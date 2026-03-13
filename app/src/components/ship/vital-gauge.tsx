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
}

export function VitalGauge({ label, sublabel, value, unit, color, icon, onPress }: VitalGaugeProps) {
  const hasData = value !== null;

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Gauge ring */}
      <View style={[styles.gaugeRing, { borderColor: hasData ? color : Colors.space.surface }]}>
        <Text style={[styles.icon, { color: hasData ? color : Colors.text.muted }]}>{icon}</Text>
      </View>

      {/* Value */}
      <Text style={[styles.value, hasData ? { color } : null]}>
        {hasData ? value : '--'}
      </Text>
      <Text style={styles.unit}>{unit}</Text>

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
