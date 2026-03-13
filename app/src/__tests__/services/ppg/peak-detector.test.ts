import { detectPeaks } from '@/services/ppg/peak-detector';
import type { PeakDetectorConfig } from '@/services/ppg/types';

const DEFAULT_CONFIG: PeakDetectorConfig = {
  minPeakDistanceMs: 250,
  maxPeakDistanceMs: 1500,
  adaptiveWindowSize: 30,
};

/** Generate a synthetic PPG-like signal: sum of sinusoids at a given BPM */
function makeSyntheticPPG(bpm: number, durationSec: number, sampleRate: number): { signal: Float64Array; timestamps: number[] } {
  const n = Math.floor(durationSec * sampleRate);
  const signal = new Float64Array(n);
  const timestamps: number[] = [];
  const freq = bpm / 60;

  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    timestamps.push(t * 1000);
    const phase = (t * freq * 2 * Math.PI);
    signal[i] = Math.sin(phase) + 0.3 * Math.sin(2 * phase);
  }
  return { signal, timestamps };
}

describe('detectPeaks', () => {
  it('detects peaks at ~72 BPM from synthetic signal', () => {
    const { signal, timestamps } = makeSyntheticPPG(72, 10, 30);
    const peaks = detectPeaks(signal, timestamps, DEFAULT_CONFIG);

    expect(peaks.length).toBeGreaterThanOrEqual(9);
    expect(peaks.length).toBeLessThanOrEqual(14);

    for (let i = 1; i < peaks.length; i++) {
      const ibi = peaks[i].timestamp - peaks[i - 1].timestamp;
      expect(ibi).toBeGreaterThan(600);
      expect(ibi).toBeLessThan(1100);
    }
  });

  it('detects peaks at ~120 BPM (fast heart rate)', () => {
    const { signal, timestamps } = makeSyntheticPPG(120, 10, 30);
    const peaks = detectPeaks(signal, timestamps, DEFAULT_CONFIG);

    expect(peaks.length).toBeGreaterThanOrEqual(16);
    expect(peaks.length).toBeLessThanOrEqual(24);
  });

  it('rejects peaks that are too close (below minPeakDistanceMs)', () => {
    const signal = new Float64Array(100);
    const timestamps: number[] = [];
    for (let i = 0; i < 100; i++) {
      timestamps.push(i * (1000 / 30));
      signal[i] = i % 5 === 0 ? 1.0 : 0.0;
    }
    const peaks = detectPeaks(signal, timestamps, DEFAULT_CONFIG);
    for (let i = 1; i < peaks.length; i++) {
      const ibi = peaks[i].timestamp - peaks[i - 1].timestamp;
      expect(ibi).toBeGreaterThanOrEqual(250);
    }
  });

  it('returns empty array for flat signal', () => {
    const signal = new Float64Array(100).fill(0.5);
    const timestamps = Array.from({ length: 100 }, (_, i) => i * (1000 / 30));
    const peaks = detectPeaks(signal, timestamps, DEFAULT_CONFIG);
    expect(peaks.length).toBe(0);
  });
});
