import type { FrameData } from './types';

const FINGER_RED_THRESHOLD = 200;
const FINGER_VARIANCE_THRESHOLD = 200;

/**
 * Extract average red/green channel intensity from the center 50% of an RGBA frame.
 */
export function processFrame(
  imageData: Uint8Array,
  width: number,
  height: number,
  timestamp: number
): FrameData {
  const x0 = Math.floor(width * 0.25);
  const x1 = Math.floor(width * 0.75);
  const y0 = Math.floor(height * 0.25);
  const y1 = Math.floor(height * 0.75);

  let redSum = 0;
  let greenSum = 0;
  let redSqSum = 0;
  let count = 0;

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) * 4;
      const r = imageData[i];
      const g = imageData[i + 1];
      redSum += r;
      greenSum += g;
      redSqSum += r * r;
      count++;
    }
  }

  const redMean = redSum / count;
  const greenMean = greenSum / count;
  const redVariance = (redSqSum / count) - (redMean * redMean);

  return { timestamp, redMean, greenMean, redVariance };
}

/**
 * Determine if a finger is covering the camera lens.
 */
export function isFingerDetected(frame: FrameData): boolean {
  return frame.redMean > FINGER_RED_THRESHOLD && frame.redVariance < FINGER_VARIANCE_THRESHOLD;
}
