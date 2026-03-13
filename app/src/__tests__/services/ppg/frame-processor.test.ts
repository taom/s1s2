import { processFrame, isFingerDetected } from '@/services/ppg/frame-processor';

/** Helper: create a fake RGBA buffer where every pixel has the same color */
function makeUniformRGBA(width: number, height: number, r: number, g: number, b: number): Uint8Array {
  const buf = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    buf[i * 4] = r;
    buf[i * 4 + 1] = g;
    buf[i * 4 + 2] = b;
    buf[i * 4 + 3] = 255;
  }
  return buf;
}

describe('processFrame', () => {
  it('extracts correct red/green means from uniform image', () => {
    const data = makeUniformRGBA(100, 100, 220, 80, 30);
    const result = processFrame(data, 100, 100, 0);
    expect(result.redMean).toBeCloseTo(220, 0);
    expect(result.greenMean).toBeCloseTo(80, 0);
    expect(result.redVariance).toBeCloseTo(0, 0);
    expect(result.timestamp).toBe(0);
  });

  it('computes variance for non-uniform red channel', () => {
    const width = 100;
    const height = 100;
    const buf = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        buf[i] = (x + y) % 2 === 0 ? 200 : 210;
        buf[i + 1] = 80;
        buf[i + 2] = 30;
        buf[i + 3] = 255;
      }
    }
    const result = processFrame(buf, width, height, 100);
    expect(result.redMean).toBeCloseTo(205, 0);
    expect(result.redVariance).toBeGreaterThan(0);
    expect(result.timestamp).toBe(100);
  });

  it('uses center 50% crop', () => {
    const width = 100;
    const height = 100;
    const buf = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const inCenter = x >= 25 && x < 75 && y >= 25 && y < 75;
        buf[i] = inCenter ? 200 : 0;
        buf[i + 1] = 0;
        buf[i + 2] = 0;
        buf[i + 3] = 255;
      }
    }
    const result = processFrame(buf, width, height, 0);
    expect(result.redMean).toBeCloseTo(200, 0);
  });
});

describe('isFingerDetected', () => {
  it('returns true when red is high and variance is low', () => {
    expect(isFingerDetected({ redMean: 220, greenMean: 80, redVariance: 5, timestamp: 0 })).toBe(true);
  });

  it('returns false when red is low (no finger)', () => {
    expect(isFingerDetected({ redMean: 100, greenMean: 80, redVariance: 5, timestamp: 0 })).toBe(false);
  });

  it('returns false when variance is high (ambient light, not finger)', () => {
    expect(isFingerDetected({ redMean: 220, greenMean: 80, redVariance: 500, timestamp: 0 })).toBe(false);
  });
});
