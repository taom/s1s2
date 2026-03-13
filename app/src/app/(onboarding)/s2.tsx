import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

/**
 * Onboarding Screen 2 — S2
 *
 * The S1 pulse appears again, followed by a second pulse in cool blue.
 * A higher "dub" sound plays. Text: "This is S2."
 */
export default function OnboardingS2() {
  const router = useRouter();

  return (
    <Pressable style={styles.container} onPress={() => router.push('/(onboarding)/together')}>
      <View style={styles.content}>
        {/* S1 + S2 Waveform */}
        <Animated.View entering={FadeIn.delay(500).duration(600)} style={styles.pulseContainer}>
          <View style={styles.waveformLine}>
            {/* S1 peak */}
            <View style={[styles.wavePeak, { backgroundColor: Colors.s1.primary }]} />
            <View style={[styles.waveSegment, { backgroundColor: Colors.s1.muted, height: 2 }]} />
            {/* S2 peak */}
            <Animated.View entering={FadeIn.delay(800).duration(400)}>
              <View style={[styles.wavePeak, { backgroundColor: Colors.s2.primary, height: 30 }]} />
            </Animated.View>
            <View style={[styles.waveSegment, { backgroundColor: Colors.s2.muted, height: 2 }]} />
          </View>
        </Animated.View>

        {/* Text */}
        <Animated.Text entering={FadeInDown.delay(1400).duration(600)} style={styles.title}>
          This is{' '}
          <Text style={styles.s2Accent}>S2</Text>
          .
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(2000).duration(500)} style={styles.hint}>
          Tap to continue
        </Animated.Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.void,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  pulseContainer: {
    height: 60,
    justifyContent: 'center',
  },
  waveformLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  wavePeak: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  waveSegment: {
    width: 20,
    borderRadius: 1,
  },
  title: {
    color: Colors.text.primary,
    fontSize: FontSize.display,
    fontWeight: '300',
    letterSpacing: 1,
  },
  s2Accent: {
    color: Colors.s2.primary,
    fontWeight: '700',
  },
  hint: {
    position: 'absolute',
    bottom: 60,
    color: Colors.text.muted,
    fontSize: FontSize.sm,
  },
});
