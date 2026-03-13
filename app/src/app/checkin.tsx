import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

/**
 * Check-In Flow (Full Screen Modal)
 *
 * Step 1: Camera HR measurement
 * Step 2: BPM result + ship AI commentary
 * Step 3: Optional extras (mood, activity, sleep, BP)
 * Step 4: Travel animation
 *
 * TODO: implement full multi-step flow with camera PPG
 */
export default function CheckInScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>{'✕'}</Text>
        </Pressable>

        {/* Camera Measurement Area */}
        <View style={styles.measureArea}>
          <View style={styles.cameraCircle}>
            <View style={styles.cameraInner}>
              <Text style={styles.fingerIcon}>☝</Text>
              <Text style={styles.cameraLabel}>
                Place fingertip{'\n'}over camera
              </Text>
            </View>
            {/* Progress ring (placeholder) */}
            <View style={styles.progressRing} />
          </View>
        </View>

        {/* S1S2 Waveform (builds during measurement) */}
        <View style={styles.waveformSection}>
          <View style={styles.waveformTrack}>
            <Text style={styles.s1Label}>S1...</Text>
            <View style={[styles.waveBar, { height: 30, backgroundColor: Colors.s1.primary }]} />
            <Text style={styles.s2Label}>S2...</Text>
            <View style={[styles.waveBar, { height: 20, backgroundColor: Colors.s2.primary }]} />
          </View>
        </View>

        {/* BPM Counter */}
        <View style={styles.bpmSection}>
          <Text style={styles.bpmValue}>--</Text>
          <Text style={styles.bpmUnit}>BPM</Text>
        </View>

        {/* Ship AI Commentary (shown after measurement) */}
        <View style={styles.commentaryBox}>
          <Text style={styles.commentaryText}>
            Ready to record your engine rhythm, Captain.
          </Text>
        </View>

        {/* Quick Log Icons (shown after HR measurement) */}
        <View style={styles.quickLogs}>
          <Text style={styles.quickLogLabel}>OPTIONAL LOGS</Text>
          <View style={styles.quickLogRow}>
            {[
              { icon: '😊', label: 'Mood' },
              { icon: '🏃', label: 'Activity' },
              { icon: '😴', label: 'Sleep' },
              { icon: '💉', label: 'BP' },
            ].map((item) => (
              <Pressable key={item.label} style={styles.quickLogItem}>
                <Text style={styles.quickLogIcon}>{item.icon}</Text>
                <Text style={styles.quickLogText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <Pressable style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneText}>That's everything</Text>
        </Pressable>
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
    paddingHorizontal: Spacing.md,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.space.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: Colors.text.secondary,
    fontSize: 16,
  },

  measureArea: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  cameraCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.space.mid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraInner: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fingerIcon: {
    fontSize: 32,
  },
  cameraLabel: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
  progressRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: Colors.s1.muted,
  },

  waveformSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  waveformTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
  s1Label: {
    color: Colors.s1.primary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  s2Label: {
    color: Colors.s2.primary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },

  bpmSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  bpmValue: {
    color: Colors.text.primary,
    fontSize: FontSize.hero,
    fontWeight: '700',
  },
  bpmUnit: {
    color: Colors.text.muted,
    fontSize: FontSize.lg,
  },

  commentaryBox: {
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.star.gold,
  },
  commentaryText: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  quickLogs: {
    marginTop: 'auto',
    gap: Spacing.sm,
  },
  quickLogLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
    textAlign: 'center',
  },
  quickLogRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  quickLogItem: {
    alignItems: 'center',
    backgroundColor: Colors.space.mid,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: 4,
  },
  quickLogIcon: {
    fontSize: 24,
  },
  quickLogText: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
  },

  doneButton: {
    backgroundColor: Colors.space.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  doneText: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
