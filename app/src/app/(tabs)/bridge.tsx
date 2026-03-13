import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { VitalGauge } from '@/components/ship/vital-gauge';
import { FuelBar } from '@/components/ship/fuel-bar';
import { StarfieldBackground } from '@/components/ship/starfield-background';
import { useUserStore } from '@/stores/user-store';
import { useJourneyStore } from '@/stores/journey-store';
import { useLatestVitals } from '@/hooks/use-latest-vitals';

/**
 * Bridge (Home Screen)
 *
 * The cockpit view. Displays current vitals as ship instruments.
 * Galaxy visible through the main viewport. This is where check-ins happen.
 */
export default function BridgeScreen() {
  const router = useRouter();

  const { profile } = useUserStore();
  const { progress, todayFuel } = useJourneyStore();
  const { vitals, status, isLoading, refresh } = useLatestVitals();

  // Re-fetch vitals when screen gains focus (returning from check-in)
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  // Compute level from XP
  const level = progress ? Math.floor(progress.totalXpEarned / 100) + 1 : 1;

  // Capitalize ship class
  const rawClass = progress?.shipClass ?? 'pod';
  const shipClassLabel = rawClass.charAt(0).toUpperCase() + rawClass.slice(1) + ' Class';

  return (
    <View style={styles.container}>
      <StarfieldBackground />

      <SafeAreaView style={styles.safe}>
        {/* ─── Top Bar ─── */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.shipName}>{profile?.shipName ?? 'Unnamed Vessel'}</Text>
            <Text style={styles.shipClass}>{shipClassLabel}</Text>
          </View>
          <View style={styles.topRight}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>{'🔥'}</Text>
              <Text style={styles.streakCount}>{progress?.currentStreak ?? 0}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>Lv {level}</Text>
            </View>
          </View>
        </View>

        {/* ─── Main Viewport (Galaxy Preview) ─── */}
        <Pressable
          style={styles.viewport}
          onPress={() => router.push('/(tabs)/galaxy')}
        >
          <View style={styles.viewportInner}>
            <Text style={styles.viewportLabel}>Current System</Text>
            <Text style={styles.systemName}>
              {progress?.currentSystemName ?? 'Awaiting First Signal...'}
            </Text>
            <View style={styles.waveformPlaceholder}>
              <View style={[styles.waveBar, { height: 12 }]} />
              <View style={[styles.waveBar, { height: 24 }]} />
              <View style={[styles.waveBar, { height: 36, backgroundColor: Colors.s1.primary }]} />
              <View style={[styles.waveBar, { height: 20 }]} />
              <View style={[styles.waveBar, { height: 32, backgroundColor: Colors.s2.primary }]} />
              <View style={[styles.waveBar, { height: 16 }]} />
              <View style={[styles.waveBar, { height: 28 }]} />
              <View style={[styles.waveBar, { height: 8 }]} />
            </View>
          </View>
          <Text style={styles.tapHint}>Tap to view galaxy map</Text>
        </Pressable>

        {/* ─── Ship Instrument Panel ─── */}
        <View style={styles.instrumentPanel}>
          <Text style={styles.panelLabel}>SHIP INSTRUMENTS</Text>
          <View style={styles.gaugeRow}>
            <VitalGauge
              label="Engine"
              sublabel="Heart Rate"
              value={vitals.heartRate?.value ?? null}
              unit="BPM"
              color={Colors.s1.primary}
              icon="♥"
              delta={vitals.heartRate?.delta}
              status={status.heartRate}
            />
            <VitalGauge
              label="Fuel Pressure"
              sublabel="Blood Pressure"
              value={vitals.bpSystolic?.value ?? null}
              unit="mmHg"
              color={Colors.star.ember}
              icon="◆"
              delta={vitals.bpSystolic?.delta}
              status={status.bp}
              secondaryValue={vitals.bpDiastolic?.value}
            />
          </View>
          <View style={styles.gaugeRow}>
            <VitalGauge
              label="Shields"
              sublabel="HRV"
              value={vitals.hrv?.value ?? null}
              unit="ms"
              color={Colors.s2.primary}
              icon="◇"
              delta={vitals.hrv?.delta}
              status={status.hrv}
            />
            <VitalGauge
              label="Life Support"
              sublabel="SpO2"
              value={null}
              unit="%"
              color={Colors.star.aurora}
              icon="○"
            />
          </View>
        </View>

        {/* ─── Fuel Status ─── */}
        <FuelBar fuel={todayFuel} />

        {/* ─── Action Bar ─── */}
        <View style={styles.actionBar}>
          <Pressable
            style={styles.actionSecondary}
            onPress={() => {/* TODO: manual log */}}
          >
            <Text style={styles.actionSecondaryText}>Log</Text>
          </Pressable>

          <Pressable
            style={styles.checkInButton}
            onPress={() => router.push('/checkin')}
          >
            <View style={styles.checkInInner}>
              <Text style={styles.checkInS1}>S1</Text>
              <Text style={styles.checkInDivider}>·</Text>
              <Text style={styles.checkInS2}>S2</Text>
            </View>
            <Text style={styles.checkInLabel}>CHECK IN</Text>
          </Pressable>

          <Pressable
            style={styles.actionSecondary}
            onPress={() => {/* TODO: play today's music */}}
          >
            <Text style={styles.actionSecondaryText}>Play</Text>
          </Pressable>
        </View>
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

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  shipName: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  shipClass: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  topRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.space.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  streakIcon: { fontSize: 14 },
  streakCount: {
    color: Colors.star.gold,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  xpBadge: {
    backgroundColor: Colors.space.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  xpText: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },

  // Viewport
  viewport: {
    flex: 1,
    backgroundColor: Colors.space.void,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.space.surface,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 180,
  },
  viewportInner: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  viewportLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  systemName: {
    color: Colors.text.secondary,
    fontSize: FontSize.lg,
    fontStyle: 'italic',
  },
  waveformPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 40,
    marginTop: Spacing.sm,
  },
  waveBar: {
    width: 4,
    backgroundColor: Colors.space.nebula,
    borderRadius: 2,
  },
  tapHint: {
    position: 'absolute',
    bottom: Spacing.sm,
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },

  // Instrument Panel
  instrumentPanel: {
    gap: Spacing.sm,
  },
  panelLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  gaugeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Fuel
  fuelSection: {
    marginVertical: Spacing.sm,
  },

  // Action Bar
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  actionSecondary: {
    flex: 1,
    backgroundColor: Colors.space.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  actionSecondaryText: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  checkInButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.s1.primary,
    paddingVertical: Spacing.md,
    ...Shadows.card,
  },
  checkInInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkInS1: {
    color: Colors.s1.primary,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  checkInDivider: {
    color: Colors.text.muted,
    fontSize: FontSize.xl,
  },
  checkInS2: {
    color: Colors.s2.primary,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  checkInLabel: {
    color: Colors.text.secondary,
    fontSize: FontSize.xs,
    letterSpacing: 2,
    marginTop: 2,
  },
});
