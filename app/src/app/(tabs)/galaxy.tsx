import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';

/**
 * Navigation Console (Galaxy Map)
 *
 * Full-screen galaxy map. Pinch to zoom from current system
 * to full journey view. Each visited system is colored by health data.
 */

// Placeholder star system nodes for the skeleton
const PLACEHOLDER_SYSTEMS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 30 + Math.sin(i * 0.8) * 25 + (i % 3) * 10,
  y: 10 + i * 7,
  visited: false,
  type: ['nebula', 'stellar_nursery', 'asteroid_field', 'gas_giant'][i % 4],
}));

export default function GalaxyScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Navigation Console</Text>
            <Text style={styles.subtitle}>0 systems visited</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.s2.primary }]} />
              <Text style={styles.legendText}>Calm</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.star.gold }]} />
              <Text style={styles.legendText}>Active</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.harmonic.primary }]} />
              <Text style={styles.legendText}>Intense</Text>
            </View>
          </View>
        </View>

        {/* Galaxy Map Canvas */}
        <View style={styles.mapContainer}>
          {/* Connection lines (simplified) */}
          <View style={styles.pathLine} />

          {/* Star system nodes */}
          {PLACEHOLDER_SYSTEMS.map((system) => (
            <Pressable
              key={system.id}
              style={[
                styles.systemNode,
                {
                  left: `${system.x}%`,
                  top: `${system.y}%`,
                },
                system.id === 0 && styles.currentSystem,
              ]}
            >
              <View
                style={[
                  styles.systemDot,
                  system.id === 0 && styles.currentDot,
                  system.visited && styles.visitedDot,
                ]}
              />
              {system.id === 0 && (
                <View style={styles.shipIndicator}>
                  <Text style={styles.shipIcon}>▲</Text>
                </View>
              )}
            </Pressable>
          ))}

          {/* Fog of war overlay */}
          <View style={styles.fogOfWar}>
            <Text style={styles.fogText}>Uncharted Space</Text>
            <Text style={styles.fogHint}>Check in to fuel your journey forward</Text>
          </View>

          {/* Current position info */}
          <View style={styles.positionCard}>
            <Text style={styles.positionLabel}>CURRENT POSITION</Text>
            <Text style={styles.positionSystem}>Origin System</Text>
            <View style={styles.positionStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0.0</Text>
                <Text style={styles.statLabel}>Fuel</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Systems</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Creatures</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.void,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: Colors.text.primary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },

  // Map
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  pathLine: {
    position: 'absolute',
    left: '40%',
    top: '8%',
    width: 2,
    height: '60%',
    backgroundColor: Colors.space.surface,
    opacity: 0.3,
  },
  systemNode: {
    position: 'absolute',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -16,
    marginTop: -16,
  },
  systemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.space.nebula,
  },
  currentSystem: {},
  currentDot: {
    backgroundColor: Colors.s1.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  visitedDot: {
    backgroundColor: Colors.s2.primary,
  },
  shipIndicator: {
    position: 'absolute',
    top: -14,
  },
  shipIcon: {
    color: Colors.star.gold,
    fontSize: 12,
  },

  // Fog
  fogOfWar: {
    position: 'absolute',
    bottom: '25%',
    left: 0,
    right: 0,
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  fogText: {
    color: Colors.text.muted,
    fontSize: FontSize.md,
    fontStyle: 'italic',
    letterSpacing: 2,
  },
  fogHint: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },

  // Position Card
  positionCard: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.space.surface,
    padding: Spacing.md,
    alignItems: 'center',
  },
  positionLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  positionSystem: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  positionStats: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.text.primary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.space.surface,
  },
});
