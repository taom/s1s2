/**
 * Music Store (zustand)
 *
 * Manages the 5-layer music engine state, playback mode,
 * and S1/S2 fundamental tones.
 *
 * TODO: wire up to expo-av and optional Tone.js after deps installed
 */

// import { create } from 'zustand';

import type { PlaybackMode, MusicSession } from '@/types';

export interface MusicState {
  // Playback
  isPlaying: boolean;
  currentMode: PlaybackMode | null;
  currentSession: MusicSession | null;

  // S1S2 Fundamentals (derived from resting HR)
  s1FrequencyHz: number;  // default 65.4 Hz (C2 at 65 BPM resting)
  s2FrequencyHz: number;  // perfect 5th above: 98.0 Hz (G2)

  // Layer states
  layers: {
    fundamentals: boolean;
    biomeBed: boolean;
    creatureVoices: boolean;
    vitalModulation: boolean;
    events: boolean;
  };

  // Actions
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
  // Linear interpolation between known points
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
  return s1Hz * 1.5; // perfect fifth ratio
}

// Placeholder until zustand is installed
export const useMusicStore = (() => {
  let state: MusicState = {
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
    play: () => {},
    pause: () => {},
    updateFundamentals: () => {},
    toggleLayer: () => {},
  };
  return () => state;
})();
