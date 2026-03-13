import { create } from 'zustand';
import type { CreatureDiscovery, CreatureSpecies, ResonanceClass, Rarity } from '@/types';
import { insertCreatureDiscovery, updateCreatureDiscovery } from '@/services/database';
import { MVP_CREATURES } from '@/constants/creatures';

export interface CreatureState {
  species: CreatureSpecies[];
  discoveries: CreatureDiscovery[];
  filterClass: ResonanceClass | 'all';
  filterRarity: Rarity | 'all';

  setSpecies: (species: CreatureSpecies[]) => void;
  addDiscovery: (discovery: Omit<CreatureDiscovery, 'discoveredAt'>) => void;
  setFilter: (filterClass: ResonanceClass | 'all') => void;
  setRarityFilter: (filterRarity: Rarity | 'all') => void;
  toggleFavorite: (discoveryId: string) => void;
  hydrate: (discoveries: CreatureDiscovery[]) => void;
}

export const useCreatureStore = create<CreatureState>((set, get) => ({
  species: MVP_CREATURES,
  discoveries: [],
  filterClass: 'all',
  filterRarity: 'all',

  hydrate: (discoveries) => {
    set({ discoveries });
  },

  setSpecies: (species) => set({ species }),

  addDiscovery: (discovery) => {
    const full: CreatureDiscovery = {
      ...discovery,
      discoveredAt: new Date().toISOString(),
    };
    set((state) => ({ discoveries: [full, ...state.discoveries] }));
    insertCreatureDiscovery(discovery);
  },

  setFilter: (filterClass) => set({ filterClass }),

  setRarityFilter: (filterRarity) => set({ filterRarity }),

  toggleFavorite: (discoveryId) => {
    const current = get().discoveries.find((d) => d.id === discoveryId);
    if (!current) return;
    const newFav = !current.isFavorite;
    set((state) => ({
      discoveries: state.discoveries.map((d) =>
        d.id === discoveryId ? { ...d, isFavorite: newFav } : d
      ),
    }));
    updateCreatureDiscovery(discoveryId, { isFavorite: newFav });
  },
}));
