import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import type { Rarity, ResonanceClass } from '@/types';

/**
 * Resonance Chamber (Creature Gallery)
 *
 * A beautiful room where discovered creatures live. They have idle animations,
 * and their acoustic signatures play softly as ambient background.
 */

// Placeholder creature for UI skeleton
interface CreatureCard {
  id: string;
  name: string;
  resonanceClass: ResonanceClass;
  rarity: Rarity;
  discovered: boolean;
}

const PLACEHOLDER_CREATURES: CreatureCard[] = [
  { id: '1', name: 'First Pulse', resonanceClass: 's1', rarity: 'common', discovered: false },
  { id: '2', name: 'Drift Medusa', resonanceClass: 's2', rarity: 'common', discovered: false },
  { id: '3', name: 'Balance Bug', resonanceClass: 'harmonic', rarity: 'common', discovered: false },
  { id: '4', name: 'Dawn Moth', resonanceClass: 's1', rarity: 'common', discovered: false },
  { id: '5', name: 'Settle Frog', resonanceClass: 's2', rarity: 'common', discovered: false },
  { id: '6', name: '???', resonanceClass: 's1', rarity: 'uncommon', discovered: false },
  { id: '7', name: '???', resonanceClass: 's2', rarity: 'rare', discovered: false },
  { id: '8', name: '???', resonanceClass: 'harmonic', rarity: 'epic', discovered: false },
];

const RARITY_COLORS: Record<Rarity, string> = {
  common: Colors.rarity.common,
  uncommon: Colors.rarity.uncommon,
  rare: Colors.rarity.rare,
  epic: Colors.rarity.epic,
  legendary: Colors.rarity.legendary,
  mythic: Colors.rarity.mythic,
};

const CLASS_LABELS: Record<ResonanceClass, { icon: string; color: string }> = {
  s1: { icon: '🔥', color: Colors.s1.primary },
  s2: { icon: '🌊', color: Colors.s2.primary },
  harmonic: { icon: '⚖️', color: Colors.harmonic.primary },
};

function CreatureSlot({ creature }: { creature: CreatureCard }) {
  const classInfo = CLASS_LABELS[creature.resonanceClass];
  const rarityColor = RARITY_COLORS[creature.rarity];

  return (
    <Pressable style={styles.creatureSlot}>
      {/* Creature silhouette area */}
      <View style={[styles.creatureImage, { borderColor: creature.discovered ? rarityColor : Colors.space.surface }]}>
        {creature.discovered ? (
          <Text style={styles.creatureEmoji}>{classInfo.icon}</Text>
        ) : (
          <Text style={styles.silhouette}>?</Text>
        )}
        {/* Rarity indicator dot */}
        <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
      </View>

      {/* Name */}
      <Text
        style={[styles.creatureName, !creature.discovered && styles.undiscoveredName]}
        numberOfLines={1}
      >
        {creature.discovered ? creature.name : '???'}
      </Text>

      {/* Class badge */}
      <View style={[styles.classBadge, { backgroundColor: classInfo.color + '20' }]}>
        <Text style={[styles.classLabel, { color: classInfo.color }]}>
          {creature.resonanceClass === 'harmonic' ? 'H' : creature.resonanceClass.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ChamberScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Resonance Chamber</Text>
          <Text style={styles.subtitle}>0 / 50 species discovered</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(['all', 's1', 's2', 'harmonic'] as const).map((filter) => (
            <Pressable
              key={filter}
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                {filter === 'all' ? 'All' : filter === 'harmonic' ? 'Harmonic' : filter.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Creature Grid */}
        <FlatList
          data={PLACEHOLDER_CREATURES}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => <CreatureSlot creature={item} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Your chamber awaits its first inhabitants.
              </Text>
              <Text style={styles.emptyHint}>
                Check in to begin discovering creatures.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.deep,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    color: Colors.text.primary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.space.mid,
  },
  filterTabActive: {
    backgroundColor: Colors.space.nebula,
    borderWidth: 1,
    borderColor: Colors.s1.muted,
  },
  filterText: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.text.primary,
  },

  // Grid
  gridContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  gridRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  // Creature Slot
  creatureSlot: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  creatureImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.space.surface,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatureEmoji: {
    fontSize: 28,
  },
  silhouette: {
    color: Colors.text.muted,
    fontSize: 28,
    fontWeight: '300',
  },
  rarityDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.space.mid,
  },
  creatureName: {
    color: Colors.text.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  undiscoveredName: {
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  classBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  classLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.text.secondary,
    fontSize: FontSize.lg,
    fontStyle: 'italic',
  },
  emptyHint: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
  },
});
