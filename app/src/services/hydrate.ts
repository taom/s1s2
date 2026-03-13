/**
 * Store Hydration Service
 *
 * Reads SQLite and populates all zustand stores on app startup.
 * Called once from the root layout after initDatabase() resolves.
 */

import {
  getUserPreferences,
  getJourneyProgress,
  getCreatureDiscoveries,
  getTodayScanResults,
} from '@/services/database';
import { useUserStore } from '@/stores/user-store';
import { useJourneyStore } from '@/stores/journey-store';
import { useCreatureStore } from '@/stores/creature-store';

export async function hydrateStores(): Promise<{ isOnboarded: boolean }> {
  const [prefs, journey, discoveries, todayScans] = await Promise.all([
    getUserPreferences(),
    getJourneyProgress(),
    getCreatureDiscoveries(),
    getTodayScanResults(),
  ]);

  useUserStore.getState().hydrate(prefs, journey);
  useJourneyStore.getState().hydrate(journey, todayScans);
  useCreatureStore.getState().hydrate(discoveries);

  return { isOnboarded: prefs?.onboardingCompleted ?? false };
}
