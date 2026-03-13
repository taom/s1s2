import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';

/**
 * Signal Deck (Insights & History)
 *
 * Health insights delivered as "decoded transmissions."
 * Vitals history displayed as signal waveforms.
 * Correlations appear as "pattern locks."
 */

interface Transmission {
  id: string;
  title: string;
  message: string;
  type: 'welcome' | 'insight' | 'pattern' | 'milestone';
  timestamp: string;
}

const PLACEHOLDER_TRANSMISSIONS: Transmission[] = [
  {
    id: '1',
    title: 'Welcome Transmission',
    message: 'Greetings, Captain. Your Signal Deck is online. As you check in, I\'ll decode patterns in your vitals and deliver insights here.',
    type: 'welcome',
    timestamp: 'Just now',
  },
];

const TRANSMISSION_COLORS: Record<Transmission['type'], string> = {
  welcome: Colors.star.gold,
  insight: Colors.s2.primary,
  pattern: Colors.harmonic.primary,
  milestone: Colors.star.aurora,
};

export default function SignalsScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Signal Deck</Text>
          <Text style={styles.subtitle}>Decoded transmissions & patterns</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>♥</Text>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Avg HR</Text>
            <Text style={styles.statPeriod}>7 days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>◆</Text>
            <Text style={styles.statValue}>--/--</Text>
            <Text style={styles.statLabel}>Avg BP</Text>
            <Text style={styles.statPeriod}>7 days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>◇</Text>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Avg HRV</Text>
            <Text style={styles.statPeriod}>7 days</Text>
          </View>
        </View>

        {/* Waveform Preview */}
        <View style={styles.waveformCard}>
          <Text style={styles.waveformLabel}>VITAL SIGNAL HISTORY</Text>
          <View style={styles.waveformArea}>
            {/* Placeholder flat line */}
            <View style={styles.flatLine} />
            <Text style={styles.noDataText}>Awaiting first signals...</Text>
          </View>
          <View style={styles.waveformLegend}>
            <View style={styles.wLegendItem}>
              <View style={[styles.wLegendLine, { backgroundColor: Colors.s1.primary }]} />
              <Text style={styles.wLegendText}>Heart Rate</Text>
            </View>
            <View style={styles.wLegendItem}>
              <View style={[styles.wLegendLine, { backgroundColor: Colors.s2.primary }]} />
              <Text style={styles.wLegendText}>HRV</Text>
            </View>
          </View>
        </View>

        {/* Transmissions */}
        <Text style={styles.sectionLabel}>TRANSMISSIONS</Text>
        <ScrollView style={styles.transmissions} contentContainerStyle={styles.transmissionsContent}>
          {PLACEHOLDER_TRANSMISSIONS.map((t) => (
            <View key={t.id} style={styles.transmissionCard}>
              <View style={[styles.transmissionAccent, { backgroundColor: TRANSMISSION_COLORS[t.type] }]} />
              <View style={styles.transmissionBody}>
                <View style={styles.transmissionHeader}>
                  <Text style={styles.transmissionTitle}>{t.title}</Text>
                  <Text style={styles.transmissionTime}>{t.timestamp}</Text>
                </View>
                <Text style={styles.transmissionMessage}>{t.message}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Doctor Report Button */}
        <Pressable style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Generate Doctor Visit Report</Text>
          <Text style={styles.reportButtonHint}>Requires 7+ days of data</Text>
        </Pressable>
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
    paddingHorizontal: Spacing.md,
  },
  header: {
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
    marginTop: 2,
  },

  // Quick Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statIcon: {
    color: Colors.text.muted,
    fontSize: 16,
    marginBottom: 2,
  },
  statValue: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
  },
  statPeriod: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },

  // Waveform
  waveformCard: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  waveformLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  waveformArea: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.space.surface,
  },
  noDataText: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
  },
  waveformLegend: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  wLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wLegendLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  wLegendText: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },

  // Transmissions
  sectionLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  transmissions: {
    flex: 1,
  },
  transmissionsContent: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  transmissionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  transmissionAccent: {
    width: 3,
  },
  transmissionBody: {
    flex: 1,
    padding: Spacing.md,
  },
  transmissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  transmissionTitle: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  transmissionTime: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },
  transmissionMessage: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },

  // Report Button
  reportButton: {
    backgroundColor: Colors.space.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.space.nebula,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
    opacity: 0.5,
  },
  reportButtonText: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  reportButtonHint: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
