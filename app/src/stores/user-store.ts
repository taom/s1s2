/**
 * User Store (zustand)
 *
 * Manages user profile state, onboarding status, and session data.
 * Ephemeral UI state — persisted data lives in SQLite.
 *
 * TODO: wire up to SQLite and Supabase after deps installed
 */

// import { create } from 'zustand';

import type { ShipClass, UserProfile } from '@/types';

export interface UserState {
  // Profile
  profile: UserProfile | null;
  isOnboarded: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  setCaptainName: (name: string) => void;
  setShipName: (name: string) => void;
  completeOnboarding: () => void;
}

// Placeholder until zustand is installed
export const useUserStore = (() => {
  let state: UserState = {
    profile: null,
    isOnboarded: false,
    setProfile: () => {},
    setCaptainName: () => {},
    setShipName: () => {},
    completeOnboarding: () => {},
  };
  return () => state;
})();

/*
// Real implementation (uncomment when zustand is installed):
export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isOnboarded: false,

  setProfile: (profile) => set({ profile }),

  setCaptainName: (name) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, displayName: name } : null,
    })),

  setShipName: (name) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, shipName: name } : null,
    })),

  completeOnboarding: () => set({ isOnboarded: true }),
}));
*/
