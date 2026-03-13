import type {
  PPGCallbacks,
  PPGEngineConfig,
  MeasurementResult,
  QualityLevel,
} from './types';
import { processFrame, isFingerDetected } from './frame-processor';
import { createBandpassFilter, applyFilter } from './filters';
import { detectPeaks } from './peak-detector';
import type { FIRFilter } from './types';

const DEFAULT_CONFIG: PPGEngineConfig = {
  measurementDurationMs: 30000,
  earlyExitMinMs: 15000,
  earlyExitConfidence: 0.8,
  calibrationMs: 5000,
  processingIntervalFrames: 15,
  bufferDurationMs: 10000,
  sampleRateHz: 30,
};

export class PPGEngine {
  private config: PPGEngineConfig;
  private callbacks: PPGCallbacks;
  private filter: FIRFilter;

  // State
  private running = false;
  private frameCount = 0;
  private startTime = 0;
  private fingerDetected = false;

  // Circular buffer
  private redBuffer: number[] = [];
  private greenBuffer: number[] = [];
  private timestampBuffer: number[] = [];
  private maxBufferSize: number;

  // Tracking
  private lastFingerState = false;
  private allPeakTimestamps: number[] = [];
  private calibrated = false;
  private highConfidenceSince: number | null = null;
  private lastPeakCount = 0; // track new peaks for per-beat callbacks

  constructor(callbacks: PPGCallbacks, config?: Partial<PPGEngineConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.callbacks = callbacks;
    this.maxBufferSize = Math.ceil(
      (this.config.bufferDurationMs / 1000) * this.config.sampleRateHz
    );
    this.filter = createBandpassFilter({
      lowCutHz: 0.7,
      highCutHz: 4.0,
      sampleRateHz: this.config.sampleRateHz,
      order: 64,
    });
  }

  start(): void {
    this.reset();
    this.running = true;
    this.startTime = Date.now();
    this.callbacks.onQualityChange('calibrating');
  }

  stop(): MeasurementResult | null {
    this.running = false;
    return this.computeResult();
  }

  reset(): void {
    this.running = false;
    this.frameCount = 0;
    this.startTime = 0;
    this.fingerDetected = false;
    this.lastFingerState = false;
    this.redBuffer = [];
    this.greenBuffer = [];
    this.timestampBuffer = [];
    this.allPeakTimestamps = [];
    this.calibrated = false;
    this.highConfidenceSince = null;
    this.lastPeakCount = 0;
  }

  addFrame(imageData: Uint8Array, width: number, height: number): void {
    if (!this.running) return;

    // Use frame counter for consistent timestamps (works in both real-time and test scenarios)
    const frameTimestamp = (this.frameCount / this.config.sampleRateHz) * 1000;
    const frame = processFrame(imageData, width, height, frameTimestamp);

    // Finger detection
    const detected = isFingerDetected(frame);
    if (detected !== this.lastFingerState) {
      this.lastFingerState = detected;
      this.fingerDetected = detected;
      this.callbacks.onFingerDetected(detected);
    }

    if (!this.fingerDetected) return;

    // Buffer management
    this.redBuffer.push(frame.redMean);
    this.greenBuffer.push(frame.greenMean);
    this.timestampBuffer.push(frame.timestamp);

    while (this.redBuffer.length > this.maxBufferSize) {
      this.redBuffer.shift();
      this.greenBuffer.shift();
      this.timestampBuffer.shift();
    }

    this.frameCount++;

    // Process at interval
    if (this.frameCount % this.config.processingIntervalFrames === 0) {
      this.process();
    }
  }

  private process(): void {
    if (this.redBuffer.length < 30) return;

    // Apply bandpass filter
    const signal = new Float64Array(this.redBuffer);
    const filtered = applyFilter(this.filter, signal);

    // Detect peaks
    const peaks = detectPeaks(filtered, this.timestampBuffer, {
      minPeakDistanceMs: 250,
      maxPeakDistanceMs: 1500,
      adaptiveWindowSize: Math.min(30, Math.floor(this.redBuffer.length / 3)),
    });

    if (peaks.length < 2) return;

    // Compute IBIs
    const ibis: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      ibis.push(peaks[i].timestamp - peaks[i - 1].timestamp);
    }

    // Instantaneous HR from last 3-5 IBIs
    const recentIBIs = ibis.slice(-Math.min(5, ibis.length));
    let ibiSum = 0;
    for (let i = 0; i < recentIBIs.length; i++) ibiSum += recentIBIs[i];
    const avgIBI = ibiSum / recentIBIs.length;
    const instantHR = 60000 / avgIBI;

    // Confidence
    const confidence = this.computeConfidence(filtered, peaks, ibis);

    // Calibration check
    const elapsedMs = (this.frameCount / this.config.sampleRateHz) * 1000;
    if (!this.calibrated && elapsedMs >= this.config.calibrationMs && confidence > 0.5) {
      this.calibrated = true;
    }

    if (this.calibrated) {
      this.callbacks.onHRUpdate(Math.round(instantHR), confidence);

      // Fire onBeatDetected once per NEW peak (not per processing cycle)
      const newPeakCount = peaks.length - this.lastPeakCount;
      for (let i = 0; i < newPeakCount; i++) {
        this.callbacks.onBeatDetected(Math.round(instantHR));
      }
      this.lastPeakCount = peaks.length;

      const quality = this.confidenceToQuality(confidence);
      this.callbacks.onQualityChange(quality);

      // Early exit: confidence > threshold sustained for 5+ seconds after earlyExitMinMs
      if (elapsedMs >= this.config.earlyExitMinMs && confidence >= this.config.earlyExitConfidence) {
        if (this.highConfidenceSince === null) {
          this.highConfidenceSince = elapsedMs;
        } else if (elapsedMs - this.highConfidenceSince >= 5000) {
          // Sustained high confidence for 5 seconds — signal early completion
          const result = this.computeResult();
          if (result) {
            this.running = false;
            this.callbacks.onMeasurementComplete(result);
            return;
          }
        }
      } else {
        this.highConfidenceSince = null;
      }
    }

    // Track all peak timestamps for final result
    this.allPeakTimestamps = peaks.map(p => p.timestamp);
  }

  private computeConfidence(
    signal: Float64Array,
    peaks: { amplitude: number }[],
    ibis: number[]
  ): number {
    let score = 0;

    // 1. Signal amplitude (AC component above noise floor)
    let ampSum = 0;
    for (let i = 0; i < peaks.length; i++) ampSum += peaks[i].amplitude;
    const meanAmp = ampSum / peaks.length;
    if (meanAmp > 0.01) score += 0.25;

    // 2. IBI consistency (coefficient of variation < 15%)
    if (ibis.length >= 3) {
      let ibiSum = 0;
      for (let i = 0; i < ibis.length; i++) ibiSum += ibis[i];
      const meanIBI = ibiSum / ibis.length;
      let sqDiffSum = 0;
      for (let i = 0; i < ibis.length; i++) sqDiffSum += (ibis[i] - meanIBI) ** 2;
      const stdIBI = Math.sqrt(sqDiffSum / ibis.length);
      const cv = stdIBI / meanIBI;
      if (cv < 0.15) score += 0.25;
    }

    // 3. Peak regularity (>= 5 consecutive valid peaks)
    if (peaks.length >= 5) score += 0.25;

    // 4. SNR
    const snr = this.computeSNR(signal);
    if (snr > 5) score += 0.25;

    return score;
  }

  private computeSNR(signal: Float64Array): number {
    if (signal.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < signal.length; i++) sum += signal[i];
    const mean = sum / signal.length;
    let varSum = 0;
    for (let i = 0; i < signal.length; i++) varSum += (signal[i] - mean) ** 2;
    const variance = varSum / signal.length;
    const noise = Math.max(variance, 1e-10);
    return 10 * Math.log10((mean * mean) / noise);
  }

  private confidenceToQuality(confidence: number): QualityLevel {
    if (confidence >= 0.75) return 'excellent';
    if (confidence >= 0.5) return 'good';
    if (confidence >= 0.25) return 'fair';
    return 'poor';
  }

  private computeResult(): MeasurementResult | null {
    if (this.allPeakTimestamps.length < 5) return null;

    const ibis: number[] = [];
    for (let i = 1; i < this.allPeakTimestamps.length; i++) {
      ibis.push(this.allPeakTimestamps[i] - this.allPeakTimestamps[i - 1]);
    }

    if (ibis.length === 0) return null;

    // Average HR
    let ibiSum = 0;
    for (let i = 0; i < ibis.length; i++) ibiSum += ibis[i];
    const avgIBI = ibiSum / ibis.length;
    const heartRate = Math.round(60000 / avgIBI);

    // Instantaneous HR (last 3-5 IBIs)
    const recentIBIs = ibis.slice(-Math.min(5, ibis.length));
    let recentSum = 0;
    for (let i = 0; i < recentIBIs.length; i++) recentSum += recentIBIs[i];
    const recentAvg = recentSum / recentIBIs.length;
    const heartRateInstant = Math.round(60000 / recentAvg);

    // HRV (RMSSD)
    const successiveDiffs: number[] = [];
    for (let i = 1; i < ibis.length; i++) {
      successiveDiffs.push(ibis[i] - ibis[i - 1]);
    }
    let hrv = 0;
    if (successiveDiffs.length > 0) {
      let sqSum = 0;
      for (let i = 0; i < successiveDiffs.length; i++) sqSum += successiveDiffs[i] * successiveDiffs[i];
      hrv = Math.round(Math.sqrt(sqSum / successiveDiffs.length));
    }

    // SpO2 estimate
    const redAC = this.computeAC(this.redBuffer);
    const greenAC = this.computeAC(this.greenBuffer);
    let redDC = 0;
    for (let i = 0; i < this.redBuffer.length; i++) redDC += this.redBuffer[i];
    redDC /= this.redBuffer.length;
    let greenDC = 0;
    for (let i = 0; i < this.greenBuffer.length; i++) greenDC += this.greenBuffer[i];
    greenDC /= this.greenBuffer.length;
    const ratio = greenDC > 0 && redDC > 0 ? (redAC / redDC) / (greenAC / greenDC) : 1;
    const spo2Estimate = Math.max(80, Math.min(100, Math.round(110 - 25 * ratio)));

    // Confidence for final result
    const filteredSignal = applyFilter(this.filter, new Float64Array(this.redBuffer));
    const snr = this.computeSNR(filteredSignal);
    let meanIBI = 0;
    for (let i = 0; i < ibis.length; i++) meanIBI += ibis[i];
    meanIBI /= ibis.length;
    let sqDiffSum = 0;
    for (let i = 0; i < ibis.length; i++) sqDiffSum += (ibis[i] - meanIBI) ** 2;
    const stdIBI = Math.sqrt(sqDiffSum / ibis.length);
    const cv = stdIBI / meanIBI;

    let confidence = 0;
    if (redAC > 0.5) confidence += 0.25;
    if (cv < 0.15) confidence += 0.25;
    if (this.allPeakTimestamps.length >= 5) confidence += 0.25;
    if (snr > 5) confidence += 0.25;

    const rawQuality = this.confidenceToQuality(confidence);
    const qualityLabel = (rawQuality === 'calibrating' ? 'poor' : rawQuality) as MeasurementResult['qualityLabel'];

    return {
      heartRate,
      heartRateInstant,
      hrv,
      spo2Estimate,
      confidence,
      qualityLabel,
      durationMs: (this.frameCount / this.config.sampleRateHz) * 1000,
      peakCount: this.allPeakTimestamps.length,
      signalToNoiseRatio: snr,
    };
  }

  private computeAC(buffer: number[]): number {
    if (buffer.length < 2) return 0;
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) sum += buffer[i];
    const mean = sum / buffer.length;
    let sqSum = 0;
    for (let i = 0; i < buffer.length; i++) sqSum += (buffer[i] - mean) ** 2;
    return Math.sqrt(sqSum / buffer.length);
  }
}
