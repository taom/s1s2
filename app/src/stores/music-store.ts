import { create } from 'zustand';
import type { PlaybackMode, MusicSession } from '@/types';

export interface MusicState {
  isPlaying: boolean;
  currentMode: PlaybackMode | null;
  currentSession: MusicSession | null;
  s1FrequencyHz: number;
  s2FrequencyHz: number;
  layers: {
    fundamentals: boolean;
    biomeBed: boolean;
    creatureVoices: boolean;
    vitalModulation: boolean;
    events: boolean;
  };

  play: (mode: PlaybackMode) => void;
  pause: () => void;
  updateFundamentals: (restingHR: number) => void;
  toggleLayer: (layer: keyof MusicState['layers']) => void;
}

/**
 * Maps resting heart rate to S1 fundamental frequency.
 * Based on the Sound Design Spec in the Product Bible.
 */
export function restingHRToS1Frequency(restingHR: number): number {
  const map: [number, number][] = [
    [55, 55.0],   // A1
    [60, 61.7],   // B1
    [65, 65.4],   // C2
    [70, 73.4],   // D2
    [75, 82.4],   // E2
    [80, 87.3],   // F2
    [85, 98.0],   // G2
    [90, 110.0],  // A2
  ];

  const clamped = Math.max(55, Math.min(90, restingHR));

  for (let i = 0; i < map.length - 1; i++) {
    const [hrLow, freqLow] = map[i];
    const [hrHigh, freqHigh] = map[i + 1];
    if (clamped >= hrLow && clamped <= hrHigh) {
      const t = (clamped - hrLow) / (hrHigh - hrLow);
      return freqLow + t * (freqHigh - freqLow);
    }
  }

  return 65.4; // default C2
}

/**
 * S2 is always a perfect fifth above S1.
 */
export function s1ToS2Frequency(s1Hz: number): number {
  return s1Hz * 1.5;
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  currentMode: null,
  currentSession: null,
  s1FrequencyHz: 65.4,
  s2FrequencyHz: 98.0,
  layers: {
    fundamentals: true,
    biomeBed: true,
    creatureVoices: true,
    vitalModulation: true,
    events: true,
  },

  play: (mode) => set({ isPlaying: true, currentMode: mode }),

  pause: () => set({ isPlaying: false }),

  updateFundamentals: (restingHR) => {
    const s1 = restingHRToS1Frequency(restingHR);
    set({ s1FrequencyHz: s1, s2FrequencyHz: s1ToS2Frequency(s1) });
  },

  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),
}));
