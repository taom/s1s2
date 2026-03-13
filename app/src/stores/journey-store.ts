/**
 * Journey Store (zustand)
 *
 * Manages galaxy state, travel progress, fuel, streaks, and XP.
 *
 * TODO: wire up to SQLite and Supabase after deps installed
 */

// import { create } from 'zustand';

import type { JourneyProgress, StarSystem, FuelLog, ShipClass, SHIP_CLASS_XP } from '@/types';

export interface JourneyState {
  // Galaxy
  progress: JourneyProgress | null;
  systems: StarSystem[];
  currentSystemIndex: number;

  // Daily fuel
  todayFuel: FuelLog;

  // Actions
  setProgress: (progress: JourneyProgress) => void;
  addFuel: (amount: number, source: keyof FuelLog) => void;
  travel: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

// Placeholder until zustand is installed
export const useJourneyStore = (() => {
  let state: JourneyState = {
    progress: null,
    systems: [],
    currentSystemIndex: 0,
    todayFuel: {
      heartRateCheckins: 0,
      bpLogs: 0,
      sleepLogs: 0,
      moodLogs: 0,
      activityLogs: 0,
      streakBonus: 0,
    },
    setProgress: () => {},
    addFuel: () => {},
    travel: () => {},
    incrementStreak: () => {},
    resetStreak: () => {},
  };
  return () => state;
})();
