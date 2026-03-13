import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';

/**
 * Setup Screen 2 — First Heart Rate Scan
 * "Let's hear your engine."
 *
 * Shows camera-based PPG measurement UI.
 * TODO: integrate actual camera PPG when expo-camera is set up.
 */
export default function FirstScanScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Let's hear your</Text>
        <Text style={styles.title}>Engine.</Text>

        {/* Camera Preview Placeholder */}
        <View style={styles.cameraArea}>
          <View style={styles.fingerTarget}>
            <View style={styles.fingerRing} />
            <Text style={styles.fingerText}>Place your fingertip{'\n'}over the camera</Text>
          </View>
        </View>

        {/* S1S2 Waveform Display (during measurement) */}
        <View style={styles.waveformDisplay}>
          <Text style={styles.waveformLabel}>DETECTING HEARTBEAT...</Text>
          <View style={styles.bpmDisplay}>
            <Text style={styles.bpmValue}>--</Text>
            <Text style={styles.bpmUnit}>BPM</Text>
          </View>
        </View>

        {/* Skip button for dev/testing */}
        <Pressable
          style={styles.skipButton}
          onPress={() => router.push('/(onboarding)/ship-ready')}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.void,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: 100,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: FontSize.lg,
    fontWeight: '300',
  },
  title: {
    color: Colors.s1.primary,
    fontSize: FontSize.hero,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  cameraArea: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.space.mid,
    borderWidth: 2,
    borderColor: Colors.s1.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerTarget: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  fingerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.s1.primary,
    borderStyle: 'dashed',
  },
  fingerText: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  waveformDisplay: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  waveformLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
  },
  bpmDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  bpmValue: {
    color: Colors.text.primary,
    fontSize: FontSize.hero,
    fontWeight: '700',
  },
  bpmUnit: {
    color: Colors.text.muted,
    fontSize: FontSize.md,
  },
  skipButton: {
    marginTop: 'auto',
    marginBottom: 60,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  skipText: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    textDecorationLine: 'underline',
  },
});
