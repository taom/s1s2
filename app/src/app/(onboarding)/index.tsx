import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

/**
 * Onboarding Screen 1 — S1
 *
 * Black screen. After 1 second, a warm coral waveform pulse appears.
 * A deep "lub" sound plays. Text: "This is S1."
 */
export default function OnboardingS1() {
  const router = useRouter();

  return (
    <Pressable style={styles.container} onPress={() => router.push('/(onboarding)/s2')}>
      <View style={styles.content}>
        {/* S1 Waveform Pulse */}
        <Animated.View entering={FadeIn.delay(1000).duration(800)} style={styles.pulseContainer}>
          <View style={styles.waveformLine}>
            <View style={[styles.wavePeak, { backgroundColor: Colors.s1.primary }]} />
            <View style={[styles.waveSegment, { backgroundColor: Colors.s1.primary, height: 2 }]} />
            <View style={[styles.wavePeak, { backgroundColor: Colors.s1.primary, height: 30 }]} />
            <View style={[styles.waveSegment, { backgroundColor: Colors.s1.primary, height: 2 }]} />
          </View>
        </Animated.View>

        {/* Text */}
        <Animated.Text entering={FadeInDown.delay(1800).duration(600)} style={styles.title}>
          This is{' '}
          <Text style={styles.s1Accent}>S1</Text>
          .
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(2400).duration(500)} style={styles.hint}>
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
  s1Accent: {
    color: Colors.s1.primary,
    fontWeight: '700',
  },
  hint: {
    position: 'absolute',
    bottom: 60,
    color: Colors.text.muted,
    fontSize: FontSize.sm,
  },
});
