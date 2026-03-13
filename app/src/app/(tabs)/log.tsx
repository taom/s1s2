import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';

/**
 * The Log (Profile & Settings)
 *
 * Captain's log: achievements, streaks, journey statistics.
 * Settings for reminders, privacy, sharing, wearable connections.
 */

function StatBlock({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={[styles.statValue, accent ? { color: accent } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({ label, description, hasToggle = false }: { label: string; description?: string; hasToggle?: boolean }) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.settingsInfo}>
        <Text style={styles.settingsLabel}>{label}</Text>
        {description && <Text style={styles.settingsDescription}>{description}</Text>}
      </View>
      {hasToggle ? (
        <Switch
          trackColor={{ false: Colors.space.surface, true: Colors.s1.muted }}
          thumbColor={Colors.text.primary}
          value={false}
        />
      ) : (
        <Text style={styles.settingsArrow}>›</Text>
      )}
    </View>
  );
}

export default function LogScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Captain Card */}
          <View style={styles.captainCard}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarText}>C</Text>
            </View>
            <Text style={styles.captainTitle}>Captain</Text>
            <Text style={styles.captainName}>Set Your Name</Text>
            <Text style={styles.shipInfo}>Pod Class · Unnamed Vessel</Text>
          </View>

          {/* Journey Statistics */}
          <Text style={styles.sectionTitle}>JOURNEY STATISTICS</Text>
          <View style={styles.statsGrid}>
            <StatBlock label="Days Active" value="0" />
            <StatBlock label="Check-ins" value="0" />
            <StatBlock label="Current Streak" value="0" accent={Colors.star.gold} />
            <StatBlock label="Longest Streak" value="0" />
            <StatBlock label="Systems Visited" value="0" />
            <StatBlock label="Creatures Found" value="0" accent={Colors.star.aurora} />
            <StatBlock label="Total XP" value="0" />
            <StatBlock label="Ship Class" value="Pod" accent={Colors.s1.primary} />
          </View>

          {/* Achievements */}
          <Text style={styles.sectionTitle}>FREQUENCIES (ACHIEVEMENTS)</Text>
          <View style={styles.achievementsPreview}>
            <Text style={styles.achievementEmpty}>
              Complete your first check-in to unlock your first Frequency.
            </Text>
          </View>

          {/* Settings */}
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.settingsGroup}>
            <SettingsRow label="Edit Captain Name" />
            <SettingsRow label="Edit Ship Name" />
            <SettingsRow label="Morning Reminder" description="9:00 AM" hasToggle />
            <SettingsRow label="Evening Reminder" description="9:00 PM" hasToggle />
            <SettingsRow label="Quiet Hours" description="10 PM – 7 AM" />
          </View>

          <Text style={styles.sectionTitle}>CONNECTIONS</Text>
          <View style={styles.settingsGroup}>
            <SettingsRow label="Apple Health" description="Not connected" />
            <SettingsRow label="Wearable Device" description="Not connected" />
          </View>

          <Text style={styles.sectionTitle}>DATA & PRIVACY</Text>
          <View style={styles.settingsGroup}>
            <SettingsRow label="Export Health Data" />
            <SettingsRow label="Privacy Policy" />
            <SettingsRow label="Terms of Service" />
            <SettingsRow label="Delete Account" />
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>S1S2</Text>
            <Text style={styles.appTagline}>The two sounds that power everything.</Text>
            <Text style={styles.appVersion}>v0.1.0 · Taoftware LLC</Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },

  // Captain Card
  captainCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.s1.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.space.mid,
    marginBottom: Spacing.sm,
  },
  avatarText: {
    color: Colors.s1.primary,
    fontSize: FontSize.display,
    fontWeight: '700',
  },
  captainTitle: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  captainName: {
    color: Colors.text.primary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  shipInfo: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
  },

  // Section
  sectionTitle: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statBlock: {
    width: '23%',
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: Colors.text.primary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },

  // Achievements
  achievementsPreview: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  achievementEmpty: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Settings
  settingsGroup: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.space.surface,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsLabel: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
  },
  settingsDescription: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  settingsArrow: {
    color: Colors.text.muted,
    fontSize: FontSize.xl,
  },

  // App Info
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.xs,
  },
  appName: {
    color: Colors.text.muted,
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 4,
  },
  appTagline: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    fontStyle: 'italic',
  },
  appVersion: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },
});
