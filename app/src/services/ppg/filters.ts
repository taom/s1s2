import type { FilterConfig, FIRFilter } from './types';

/**
 * Create a FIR bandpass filter using the windowed-sinc method with Hamming window.
 */
export function createBandpassFilter(config: FilterConfig): FIRFilter {
  const { lowCutHz, highCutHz, sampleRateHz, order } = config;
  const taps = order + 1;
  const m = order;
  const fcLow = lowCutHz / sampleRateHz;
  const fcHigh = highCutHz / sampleRateHz;

  const lowpass = (fc: number): Float64Array => {
    const kernel = new Float64Array(taps);
    for (let i = 0; i < taps; i++) {
      const n = i - m / 2;
      if (n === 0) {
        kernel[i] = 2 * Math.PI * fc;
      } else {
        kernel[i] = Math.sin(2 * Math.PI * fc * n) / n;
      }
      kernel[i] *= 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / m);
    }
    let sum = 0;
    for (let i = 0; i < taps; i++) sum += kernel[i];
    for (let i = 0; i < taps; i++) kernel[i] /= sum;
    return kernel;
  };

  const lpHigh = lowpass(fcHigh);
  const lpLow = lowpass(fcLow);

  const coefficients = new Float64Array(taps);
  for (let i = 0; i < taps; i++) {
    coefficients[i] = lpHigh[i] - lpLow[i];
  }

  return { coefficients, order };
}

/**
 * Apply a FIR filter to a signal using direct convolution.
 */
export function applyFilter(filter: FIRFilter, signal: Float64Array): Float64Array {
  const { coefficients } = filter;
  const n = signal.length;
  const taps = coefficients.length;
  const output = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < taps; j++) {
      const idx = i - j;
      if (idx >= 0) {
        sum += coefficients[j] * signal[idx];
      }
    }
    output[i] = sum;
  }

  return output;
}

/**
 * First-order derivative filter for peak slope enhancement.
 */
export function applyDerivativeFilter(signal: Float64Array): Float64Array {
  const n = signal.length;
  if (n < 2) return new Float64Array(0);
  const output = new Float64Array(n - 1);
  for (let i = 0; i < n - 1; i++) {
    output[i] = signal[i + 1] - signal[i];
  }
  return output;
}
