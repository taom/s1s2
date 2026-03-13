import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';

/**
 * Ship Instrument Gauge
 *
 * Displays a single vital as a ship instrument.
 * Tappable to view full history.
 */
interface VitalGaugeProps {
  label: string;
  sublabel: string;
  value: number | null;
  unit: string;
  color: string;
  icon: string;
  onPress?: () => void;
  // new
  delta?: number | null;
  status?: 'optimal' | 'normal' | 'elevated' | 'high' | 'low';
  secondaryValue?: number | null; // for BP diastolic
}

const STATUS_COLORS: Record<NonNullable<VitalGaugeProps['status']>, string> = {
  optimal:  Colors.star.aurora,    // #47FFCB
  normal:   Colors.text.secondary, // #8892A8
  elevated: Colors.star.gold,      // #FFD666
  high:     Colors.s1.primary,     // #E85D5D
  low:      Colors.s2.primary,     // #5D8DE8
};

export function VitalGauge({
  label, sublabel, value, unit, color, icon, onPress,
  delta, status, secondaryValue,
}: VitalGaugeProps) {
  const hasData = value !== null;

  // BP dual-value: "120/80" when secondaryValue is provided
  const displayValue = hasData
    ? (secondaryValue != null ? `${value}/${secondaryValue}` : String(value))
    : '--';

  // Delta indicator: positive = bad (▲ amber), negative = good (▼ green)
  const showDelta = hasData && delta != null && delta !== 0;
  const deltaUp = delta != null && delta > 0;
  const deltaLabel = showDelta
    ? (deltaUp ? `▲ ${Math.abs(delta)}` : `▼ ${Math.abs(delta)}`)
    : null;
  const deltaColor = deltaUp ? Colors.star.gold : Colors.star.aurora;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Gauge ring */}
      <View style={[styles.gaugeRing, { borderColor: hasData ? color : Colors.space.surface }]}>
        <Text style={[styles.icon, { color: hasData ? color : Colors.text.muted }]}>{icon}</Text>
      </View>

      {/* Value */}
      <Text style={[styles.value, hasData ? { color } : null]}>
        {displayValue}
      </Text>
      <Text style={styles.unit}>{unit}</Text>

      {/* Delta indicator */}
      {showDelta && (
        <Text style={[styles.delta, { color: deltaColor }]}>{deltaLabel}</Text>
      )}

      {/* Status label */}
      {status != null && hasData && (
        <Text style={[styles.status, { color: STATUS_COLORS[status] }]}>{status}</Text>
      )}

      {/* Label */}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sublabel}>{sublabel}</Text>

      {/* Add button if no data */}
      {!hasData && (
        <View style={styles.addIndicator}>
          <Text style={styles.addIcon}>+</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  gaugeRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.space.surface,
  },
  icon: {
    fontSize: 16,
  },
  value: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginTop: 2,
  },
  unit: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },
  delta: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  status: {
    fontSize: FontSize.xs,
    textTransform: 'capitalize',
  },
  label: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: 4,
  },
  sublabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },
  addIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.space.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    color: Colors.text.muted,
    fontSize: 12,
    fontWeight: '700',
  },
});
