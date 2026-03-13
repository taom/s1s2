import { PPGEngine } from '@/services/ppg/ppg-engine';
import type { PPGCallbacks, MeasurementResult, QualityLevel } from '@/services/ppg/types';

/** Generate a fake RGBA frame simulating a finger on camera at a given heartbeat phase */
function makeFingerFrame(width: number, height: number, redValue: number): Uint8Array {
  const buf = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    buf[i * 4] = redValue;
    buf[i * 4 + 1] = 80;
    buf[i * 4 + 2] = 30;
    buf[i * 4 + 3] = 255;
  }
  return buf;
}

function createMockCallbacks(): PPGCallbacks & { calls: Record<string, unknown[][]> } {
  const calls: Record<string, unknown[][]> = {
    onFingerDetected: [],
    onBeatDetected: [],
    onHRUpdate: [],
    onQualityChange: [],
    onMeasurementComplete: [],
  };
  return {
    calls,
    onFingerDetected: (d: boolean) => calls.onFingerDetected.push([d]),
    onBeatDetected: (bpm: number) => calls.onBeatDetected.push([bpm]),
    onHRUpdate: (hr: number, c: number) => calls.onHRUpdate.push([hr, c]),
    onQualityChange: (q: QualityLevel) => calls.onQualityChange.push([q]),
    onMeasurementComplete: (r: MeasurementResult) => calls.onMeasurementComplete.push([r]),
  };
}

describe('PPGEngine', () => {
  it('detects finger placement and emits callback', () => {
    const cbs = createMockCallbacks();
    const engine = new PPGEngine(cbs, { sampleRateHz: 30, processingIntervalFrames: 1 });
    engine.start();

    const frame = makeFingerFrame(100, 100, 220);
    engine.addFrame(frame, 100, 100);

    expect(cbs.calls.onFingerDetected.length).toBeGreaterThanOrEqual(1);
    expect(cbs.calls.onFingerDetected[0][0]).toBe(true);
  });

  it('detects finger removal', () => {
    const cbs = createMockCallbacks();
    const engine = new PPGEngine(cbs, { sampleRateHz: 30, processingIntervalFrames: 1 });
    engine.start();

    engine.addFrame(makeFingerFrame(100, 100, 220), 100, 100);
    engine.addFrame(makeFingerFrame(100, 100, 50), 100, 100);

    const fingerCalls = cbs.calls.onFingerDetected;
    expect(fingerCalls.some(c => c[0] === false)).toBe(true);
  });

  it('starts in calibrating quality', () => {
    const cbs = createMockCallbacks();
    const engine = new PPGEngine(cbs, { sampleRateHz: 30 });
    engine.start();

    engine.addFrame(makeFingerFrame(100, 100, 220), 100, 100);

    const qualityCalls = cbs.calls.onQualityChange;
    if (qualityCalls.length > 0) {
      expect(qualityCalls[0][0]).toBe('calibrating');
    }
  });

  it('stop() returns null with insufficient data', () => {
    const cbs = createMockCallbacks();
    const engine = new PPGEngine(cbs, { sampleRateHz: 30 });
    engine.start();

    engine.addFrame(makeFingerFrame(100, 100, 220), 100, 100);
    engine.addFrame(makeFingerFrame(100, 100, 215), 100, 100);

    const result = engine.stop();
    expect(result).toBeNull();
  });

  it('produces HR estimate from 10 seconds of simulated heartbeat', () => {
    const cbs = createMockCallbacks();
    const engine = new PPGEngine(cbs, {
      sampleRateHz: 30,
      processingIntervalFrames: 15,
      calibrationMs: 2000,
      bufferDurationMs: 10000,
    });
    engine.start();

    const totalFrames = 300; // 10 seconds
    const bpm = 72;
    const freq = bpm / 60;

    for (let i = 0; i < totalFrames; i++) {
      const t = i / 30;
      const ppgSignal = Math.sin(2 * Math.PI * freq * t);
      const redValue = Math.round(215 + 15 * ppgSignal);
      engine.addFrame(makeFingerFrame(100, 100, redValue), 100, 100);
    }

    const result = engine.stop();
    expect(result).not.toBeNull();
    if (result) {
      expect(result.heartRate).toBeGreaterThan(55);
      expect(result.heartRate).toBeLessThan(90);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.peakCount).toBeGreaterThan(5);
      expect(result.hrv).toBeGreaterThanOrEqual(0);
    }
  });

  it('reset() clears all state', () => {
    const cbs = createMockCallbacks();
    const engine = new PPGEngine(cbs, { sampleRateHz: 30 });
    engine.start();

    for (let i = 0; i < 50; i++) {
      engine.addFrame(makeFingerFrame(100, 100, 220), 100, 100);
    }

    engine.reset();
    const result = engine.stop();
    expect(result).toBeNull();
  });
});
