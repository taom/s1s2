import { create } from 'zustand';
import type { JourneyProgress, StarSystem, FuelLog, ShipClass, ScanResult } from '@/types';
import { SHIP_CLASS_XP } from '@/types';
import { upsertJourneyProgress } from '@/services/database';

export interface JourneyState {
  progress: JourneyProgress | null;
  systems: StarSystem[];
  currentSystemIndex: number;
  todayFuel: FuelLog;

  setProgress: (progress: JourneyProgress) => void;
  addFuel: (amount: number, source: keyof FuelLog) => void;
  travel: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  initJourney: (galaxySeed: string) => void;
  hydrate: (progress: JourneyProgress | null, todayScans: ScanResult[]) => void;
}

const EMPTY_FUEL: FuelLog = {
  heartRateCheckins: 0,
  bpLogs: 0,
  sleepLogs: 0,
  moodLogs: 0,
  activityLogs: 0,
  streakBonus: 0,
};

const FUEL_CAPS: Record<keyof FuelLog, number> = {
  heartRateCheckins: 3,
  bpLogs: 1,
  sleepLogs: 0.5,
  moodLogs: 0.25,
  activityLogs: 0.25,
  streakBonus: 3,
};

function computeTodayFuel(scans: ScanResult[]): FuelLog {
  const fuel = { ...EMPTY_FUEL };
  for (const scan of scans) {
    switch (scan.metricType) {
      case 'heart_rate':
      case 'resting_heart_rate':
        fuel.heartRateCheckins = Math.min(3, fuel.heartRateCheckins + 1);
        break;
      case 'blood_pressure_systolic':
      case 'blood_pressure_diastolic':
        fuel.bpLogs = Math.min(1, fuel.bpLogs + 0.5);
        break;
      case 'sleep_hours':
      case 'sleep_quality':
        fuel.sleepLogs = Math.min(0.5, fuel.sleepLogs + 0.25);
        break;
      case 'mood':
        fuel.moodLogs = Math.min(0.25, fuel.moodLogs + 0.25);
        break;
      case 'activity_type':
      case 'activity_duration':
        fuel.activityLogs = Math.min(0.25, fuel.activityLogs + 0.125);
        break;
    }
  }
  return fuel;
}

export function getTotalFuel(fuel: FuelLog): number {
  return fuel.heartRateCheckins + fuel.bpLogs + fuel.sleepLogs +
         fuel.moodLogs + fuel.activityLogs + fuel.streakBonus;
}

function computeShipClass(xp: number): ShipClass {
  if (xp >= SHIP_CLASS_XP.flagship) return 'flagship';
  if (xp >= SHIP_CLASS_XP.explorer) return 'explorer';
  if (xp >= SHIP_CLASS_XP.cruiser) return 'cruiser';
  if (xp >= SHIP_CLASS_XP.scout) return 'scout';
  return 'pod';
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  progress: null,
  systems: [],
  currentSystemIndex: 0,
  todayFuel: { ...EMPTY_FUEL },

  hydrate: (progress, todayScans) => {
    const todayFuel = computeTodayFuel(todayScans);
    if (progress) {
      todayFuel.streakBonus = Math.min(3, progress.currentStreak * 0.1);
    }
    set({
      progress,
      currentSystemIndex: progress?.currentSystemIndex ?? 0,
      todayFuel,
    });
  },

  setProgress: (progress) => {
    set({ progress, currentSystemIndex: progress.currentSystemIndex });
    upsertJourneyProgress(progress);
  },

  addFuel: (amount, source) => {
    set((state) => {
      const capped = Math.min(state.todayFuel[source] + amount, FUEL_CAPS[source]);
      const actualAdded = capped - state.todayFuel[source];
      const todayFuel = { ...state.todayFuel, [source]: capped };
      const progress = state.progress
        ? { ...state.progress, totalFuelEarned: state.progress.totalFuelEarned + actualAdded }
        : null;
      return { todayFuel, progress };
    });
    const { progress } = get();
    if (progress) upsertJourneyProgress(progress);
  },

  travel: () => {
    const { progress: current, todayFuel } = get();
    if (!current) return;
    const fuel = getTotalFuel(todayFuel);
    if (fuel < 0.5) return; // minimum fuel to travel

    const xpGain = Math.floor(fuel * 100);
    const newXp = current.totalXpEarned + xpGain;
    const progress: JourneyProgress = {
      ...current,
      currentSystemIndex: current.currentSystemIndex + 1,
      totalSystemsVisited: current.totalSystemsVisited + 1,
      totalXpEarned: newXp,
      shipClass: computeShipClass(newXp),
      lastTravelAt: new Date().toISOString(),
    };
    set({ progress, currentSystemIndex: progress.currentSystemIndex });
    upsertJourneyProgress(progress);
  },

  incrementStreak: () => {
    const current = get().progress;
    if (!current) return;
    const newStreak = current.currentStreak + 1;
    const progress: JourneyProgress = {
      ...current,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, current.longestStreak),
    };
    set((state) => ({
      progress,
      todayFuel: { ...state.todayFuel, streakBonus: Math.min(3, newStreak * 0.1) },
    }));
    upsertJourneyProgress(progress);
  },

  resetStreak: () => {
    const current = get().progress;
    if (!current) return;
    const progress: JourneyProgress = { ...current, currentStreak: 0 };
    set((state) => ({
      progress,
      todayFuel: { ...state.todayFuel, streakBonus: 0 },
    }));
    upsertJourneyProgress(progress);
  },

  initJourney: (galaxySeed) => {
    const progress: JourneyProgress = {
      galaxySeed,
      currentSystemIndex: 0,
      totalSystemsVisited: 0,
      totalFuelEarned: 0,
      totalXpEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
      shipClass: 'pod',
    };
    set({ progress, currentSystemIndex: 0, todayFuel: { ...EMPTY_FUEL } });
    upsertJourneyProgress(progress);
  },
}));
