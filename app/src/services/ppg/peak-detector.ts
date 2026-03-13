import type { Peak, PeakDetectorConfig } from './types';

const DEFAULT_CONFIG: PeakDetectorConfig = {
  minPeakDistanceMs: 250,
  maxPeakDistanceMs: 1500,
  adaptiveWindowSize: 30,
};

/**
 * Adaptive threshold peak detection for PPG waveforms.
 *
 * 1. Compute moving-average adaptive threshold
 * 2. Find local maxima above threshold
 * 3. Enforce refractory period (min distance)
 * 4. Validate IBI range
 */
export function detectPeaks(
  signal: Float64Array,
  timestamps: number[],
  config: PeakDetectorConfig = DEFAULT_CONFIG
): Peak[] {
  const n = signal.length;
  if (n < 3) return [];

  const { minPeakDistanceMs, maxPeakDistanceMs, adaptiveWindowSize } = config;

  // Step 1: Compute adaptive threshold using moving average of absolute signal
  const threshold = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const start = Math.max(0, i - adaptiveWindowSize);
    const end = Math.min(n, i + adaptiveWindowSize + 1);
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += Math.abs(signal[j]);
    }
    threshold[i] = (sum / (end - start)) * 0.6;
  }

  // Step 2: Find local maxima above threshold
  const candidates: Peak[] = [];
  for (let i = 1; i < n - 1; i++) {
    if (signal[i] > signal[i - 1] && signal[i] > signal[i + 1] && signal[i] > threshold[i]) {
      candidates.push({
        index: i,
        timestamp: timestamps[i],
        amplitude: signal[i],
      });
    }
  }

  if (candidates.length === 0) return [];

  // Step 3: Enforce minimum distance (refractory period)
  const filtered: Peak[] = [candidates[0]];
  for (let i = 1; i < candidates.length; i++) {
    const ibi = candidates[i].timestamp - filtered[filtered.length - 1].timestamp;
    if (ibi >= minPeakDistanceMs) {
      filtered.push(candidates[i]);
    } else if (candidates[i].amplitude > filtered[filtered.length - 1].amplitude) {
      filtered[filtered.length - 1] = candidates[i];
    }
  }

  // Step 4: Validate inter-beat intervals
  if (filtered.length < 2) return filtered;

  const validated: Peak[] = [filtered[0]];
  for (let i = 1; i < filtered.length; i++) {
    const ibi = filtered[i].timestamp - validated[validated.length - 1].timestamp;
    if (ibi >= minPeakDistanceMs && ibi <= maxPeakDistanceMs) {
      validated.push(filtered[i]);
    }
  }

  return validated;
}
