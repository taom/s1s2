/**
 * Creature Store (zustand)
 *
 * Manages discovered creatures, species catalog, and Field Guide state.
 *
 * TODO: wire up to SQLite and Supabase after deps installed
 */

// import { create } from 'zustand';

import type { CreatureDiscovery, CreatureSpecies, ResonanceClass, Rarity } from '@/types';

export interface CreatureState {
  // Catalog
  species: CreatureSpecies[];
  discoveries: CreatureDiscovery[];

  // Filters
  filterClass: ResonanceClass | 'all';
  filterRarity: Rarity | 'all';

  // Actions
  setSpecies: (species: CreatureSpecies[]) => void;
  addDiscovery: (discovery: CreatureDiscovery) => void;
  setFilter: (filterClass: ResonanceClass | 'all') => void;
  toggleFavorite: (discoveryId: string) => void;
}

// Placeholder until zustand is installed
export const useCreatureStore = (() => {
  let state: CreatureState = {
    species: [],
    discoveries: [],
    filterClass: 'all',
    filterRarity: 'all',
    setSpecies: () => {},
    addDiscovery: () => {},
    setFilter: () => {},
    toggleFavorite: () => {},
  };
  return () => state;
})();
