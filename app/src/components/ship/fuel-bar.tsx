import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import type { FuelLog } from '@/types';
import { getTotalFuel } from '@/stores/journey-store';

/**
 * Fuel Bar
 *
 * Shows daily fuel progress. Each cell earned today fills the bar.
 * Visual: a horizontal bar divided into segments like a fuel gauge.
 * Below the bar, chips show the breakdown of which fuel sources contributed.
 */
interface FuelBarProps {
  fuel: FuelLog;
  maxFuel?: number; // default 5
}

interface Chip {
  label: string;
  value: number;
}

function buildChips(fuel: FuelLog): Chip[] {
  const chips: Chip[] = [];
  if (fuel.heartRateCheckins > 0) chips.push({ label: `♥×${fuel.heartRateCheckins}`, value: fuel.heartRateCheckins });
  if (fuel.bpLogs > 0)           chips.push({ label: `BP×${fuel.bpLogs}`, value: fuel.bpLogs });
  if (fuel.sleepLogs > 0)        chips.push({ label: `😴×${fuel.sleepLogs}`, value: fuel.sleepLogs });
  if (fuel.moodLogs > 0)         chips.push({ label: `😊×${fuel.moodLogs}`, value: fuel.moodLogs });
  if (fuel.activityLogs > 0)     chips.push({ label: `🏃×${fuel.activityLogs}`, value: fuel.activityLogs });
  if (fuel.streakBonus > 0)      chips.push({ label: `🔥+${fuel.streakBonus}`, value: fuel.streakBonus });
  return chips;
}

export function FuelBar({ fuel, maxFuel = 5 }: FuelBarProps) {
  const segments = 5; // visual segments
  const currentFuel = getTotalFuel(fuel);
  const fillRatio = Math.min(currentFuel / maxFuel, 1);
  const chips = buildChips(fuel);

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

      {/* Breakdown chips — only shown when there is fuel */}
      {chips.length > 0 ? (
        <View style={styles.chipsRow}>
          {chips.map((chip) => (
            <View key={chip.label} style={styles.chip}>
              <Text style={styles.chipText}>{chip.label}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.actionsRow}>
          <Text style={styles.actionHint}>♥ HR check-in = 1.0</Text>
          <Text style={styles.actionHint}>◆ BP log = 0.5</Text>
          <Text style={styles.actionHint}>😴 Sleep = 0.5</Text>
        </View>
      )}
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    backgroundColor: Colors.space.surface,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  chipText: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
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
