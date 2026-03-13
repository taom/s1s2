import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';

/**
 * Fuel Bar
 *
 * Shows daily fuel progress. Each cell earned today fills the bar.
 * Visual: a horizontal bar divided into segments like a fuel gauge.
 */
interface FuelBarProps {
  currentFuel: number;
  maxFuel: number;
}

export function FuelBar({ currentFuel, maxFuel }: FuelBarProps) {
  const segments = 5; // visual segments
  const fillRatio = Math.min(currentFuel / maxFuel, 1);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>DAILY FUEL</Text>
        <Text style={styles.value}>
          <Text style={styles.valueCurrent}>{currentFuel.toFixed(1)}</Text>
          <Text style={styles.valueSep}> / </Text>
          <Text style={styles.valueMax}>{maxFuel.toFixed(1)}</Text>
        </Text>
      </View>

      <View style={styles.barTrack}>
        {Array.from({ length: segments }).map((_, i) => {
          const segmentStart = i / segments;
          const segmentEnd = (i + 1) / segments;
          const segmentFill = Math.max(0, Math.min(1, (fillRatio - segmentStart) / (segmentEnd - segmentStart)));

          return (
            <View key={i} style={styles.segment}>
              <View
                style={[
                  styles.segmentFill,
                  {
                    width: `${segmentFill * 100}%`,
                    backgroundColor: Colors.star.ember,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.actionsRow}>
        <Text style={styles.actionHint}>♥ HR check-in = 1.0</Text>
        <Text style={styles.actionHint}>◆ BP log = 0.5</Text>
        <Text style={styles.actionHint}>😴 Sleep = 0.5</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
  },
  value: {
    fontSize: FontSize.sm,
  },
  valueCurrent: {
    color: Colors.star.ember,
    fontWeight: '700',
  },
  valueSep: {
    color: Colors.text.muted,
  },
  valueMax: {
    color: Colors.text.muted,
  },
  barTrack: {
    flexDirection: 'row',
    gap: 3,
    height: 8,
  },
  segment: {
    flex: 1,
    backgroundColor: Colors.space.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionHint: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },
});
