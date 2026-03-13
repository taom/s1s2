/** Per-frame data extracted from camera RGBA buffer */
export interface FrameData {
  timestamp: number;       // ms since measurement start
  redMean: number;         // average red channel intensity (0-255)
  greenMean: number;       // average green channel intensity (for SpO2 ratio)
  redVariance: number;     // variance of red channel (finger detection)
}

/** A detected systolic peak in the PPG waveform */
export interface Peak {
  index: number;
  timestamp: number;
  amplitude: number;
}

/** Configuration for the FIR bandpass filter */
export interface FilterConfig {
  lowCutHz: number;     // 0.7
  highCutHz: number;    // 4.0
  sampleRateHz: number; // ~30 (camera fps)
  order: number;        // 64-128 taps
}

/** Opaque filter state returned by createBandpassFilter */
export interface FIRFilter {
  coefficients: Float64Array;
  order: number;
}

/** Configuration for peak detection */
export interface PeakDetectorConfig {
  minPeakDistanceMs: number;  // 250 (240 BPM max)
  maxPeakDistanceMs: number;  // 1500 (40 BPM min)
  adaptiveWindowSize: number; // samples for threshold adaptation
}

/** Final result of a completed PPG measurement */
export interface MeasurementResult {
  heartRate: number;          // BPM, averaged over measurement
  heartRateInstant: number;   // BPM, last 3-5 beats
  hrv: number;                // RMSSD of IBIs in ms
  spo2Estimate: number;       // estimated SpO2 % (from red/green ratio)
  confidence: number;         // 0.0 - 1.0
  qualityLabel: 'poor' | 'fair' | 'good' | 'excellent';
  durationMs: number;         // actual measurement duration
  peakCount: number;          // number of valid peaks detected
  signalToNoiseRatio: number; // SNR in dB
}

export type QualityLevel = 'calibrating' | 'poor' | 'fair' | 'good' | 'excellent';

/** Callbacks emitted by PPGEngine during measurement */
export interface PPGCallbacks {
  onFingerDetected: (detected: boolean) => void;
  onBeatDetected: (bpm: number) => void;
  onHRUpdate: (hr: number, confidence: number) => void;
  onQualityChange: (quality: QualityLevel) => void;
  onMeasurementComplete: (result: MeasurementResult) => void;
}

/** Configuration for PPGEngine */
export interface PPGEngineConfig {
  measurementDurationMs: number; // default 30000
  earlyExitMinMs: number;        // default 15000
  earlyExitConfidence: number;   // default 0.8
  calibrationMs: number;         // default 5000
  processingIntervalFrames: number; // default 15 (~0.5s at 30fps)
  bufferDurationMs: number;      // default 10000
  sampleRateHz: number;          // default 30
}
