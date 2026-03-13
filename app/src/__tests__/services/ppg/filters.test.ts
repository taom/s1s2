import { createBandpassFilter, applyFilter, applyDerivativeFilter } from '@/services/ppg/filters';
import type { FilterConfig } from '@/services/ppg/types';

const DEFAULT_CONFIG: FilterConfig = {
  lowCutHz: 0.7,
  highCutHz: 4.0,
  sampleRateHz: 30,
  order: 64,
};

describe('createBandpassFilter', () => {
  it('returns a FIRFilter with correct order', () => {
    const filter = createBandpassFilter(DEFAULT_CONFIG);
    expect(filter.order).toBe(64);
    expect(filter.coefficients).toBeInstanceOf(Float64Array);
    expect(filter.coefficients.length).toBe(65); // order + 1 taps
  });

  it('coefficients are symmetric (linear phase FIR)', () => {
    const filter = createBandpassFilter(DEFAULT_CONFIG);
    const n = filter.coefficients.length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
      expect(filter.coefficients[i]).toBeCloseTo(filter.coefficients[n - 1 - i], 10);
    }
  });
});

describe('applyFilter', () => {
  it('removes DC offset from constant signal', () => {
    const filter = createBandpassFilter(DEFAULT_CONFIG);
    const dc = new Float64Array(200).fill(128);
    const result = applyFilter(filter, dc);
    const rawSettled = result.slice(filter.order);
    const settled: number[] = [];
    for (let i = 0; i < rawSettled.length; i++) settled.push(rawSettled[i]);
    const maxAbs = Math.max(...settled.map((x: number) => Math.abs(x)));
    expect(maxAbs).toBeLessThan(1.0);
  });

  it('passes a 1 Hz sinusoid (within passband)', () => {
    const filter = createBandpassFilter(DEFAULT_CONFIG);
    const fs = DEFAULT_CONFIG.sampleRateHz;
    const n = 300;
    const signal = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      signal[i] = Math.sin(2 * Math.PI * 1.0 * i / fs);
    }
    const result = applyFilter(filter, signal);
    const rawSettled = result.slice(filter.order + 30);
    const settled: number[] = [];
    for (let i = 0; i < rawSettled.length; i++) settled.push(rawSettled[i]);
    const rms = Math.sqrt(settled.reduce((s: number, v: number) => s + v * v, 0) / settled.length);
    expect(rms).toBeGreaterThan(0.3);
  });

  it('attenuates a 10 Hz sinusoid (above passband)', () => {
    const filter = createBandpassFilter(DEFAULT_CONFIG);
    const fs = DEFAULT_CONFIG.sampleRateHz;
    const n = 300;
    const signal = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      signal[i] = Math.sin(2 * Math.PI * 10.0 * i / fs);
    }
    const result = applyFilter(filter, signal);
    const rawSettled = result.slice(filter.order + 30);
    const settled: number[] = [];
    for (let i = 0; i < rawSettled.length; i++) settled.push(rawSettled[i]);
    const rms = Math.sqrt(settled.reduce((s: number, v: number) => s + v * v, 0) / settled.length);
    expect(rms).toBeLessThan(0.1);
  });
});

describe('applyDerivativeFilter', () => {
  it('returns first-order differences', () => {
    const signal = new Float64Array([0, 1, 3, 6, 10]);
    const result = applyDerivativeFilter(signal);
    expect(result.length).toBe(4);
    expect(result[0]).toBeCloseTo(1);
    expect(result[1]).toBeCloseTo(2);
    expect(result[2]).toBeCloseTo(3);
    expect(result[3]).toBeCloseTo(4);
  });
});
