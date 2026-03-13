import { create } from 'zustand';
import type { UserProfile, UserPreferences, JourneyProgress } from '@/types';
import { upsertUserPreferences } from '@/services/database';

export interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  isOnboarded: boolean;

  setCaptainName: (name: string) => void;
  setShipName: (name: string) => void;
  completeOnboarding: () => void;
  hydrate: (prefs: UserPreferences | null, journey: JourneyProgress | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  preferences: null,
  isOnboarded: false,

  hydrate: (prefs, journey) => {
    if (!prefs) {
      set({ profile: null, preferences: null, isOnboarded: false });
      return;
    }

    const profile: UserProfile = {
      id: 'local-captain',
      displayName: prefs.captainName ?? 'Captain',
      shipName: prefs.shipName,
      shipClass: journey?.shipClass ?? 'pod',
      xp: journey?.totalXpEarned ?? 0,
      currentStreak: journey?.currentStreak ?? 0,
      longestStreak: journey?.longestStreak ?? 0,
      onboardingCompleted: prefs.onboardingCompleted,
    };

    set({
      profile,
      preferences: prefs,
      isOnboarded: prefs.onboardingCompleted,
    });
  },

  setCaptainName: (name) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, displayName: name } : null,
      preferences: state.preferences ? { ...state.preferences, captainName: name } : null,
    }));
    upsertUserPreferences({ captainName: name });
  },

  setShipName: (name) => {
    set((state) => ({
      profile: state.profile ? { ...state.profile, shipName: name } : null,
      preferences: state.preferences ? { ...state.preferences, shipName: name } : null,
    }));
    upsertUserPreferences({ shipName: name });
  },

  completeOnboarding: () => {
    set((state) => ({
      isOnboarded: true,
      profile: state.profile ? { ...state.profile, onboardingCompleted: true } : null,
      preferences: state.preferences ? { ...state.preferences, onboardingCompleted: true } : null,
    }));
    upsertUserPreferences({ onboardingCompleted: true });
  },
}));
