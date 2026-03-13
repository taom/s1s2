import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

/**
 * Onboarding Screen 3 — Together
 *
 * Both pulses repeat in rhythm: lub-dub, lub-dub, lub-dub.
 * The waveform traces a continuous S1S2 pattern.
 * Text: "Together, they're the sound your heart has made every moment of your life."
 */
export default function OnboardingTogether() {
  const router = useRouter();

  return (
    <Pressable style={styles.container} onPress={() => router.push('/(onboarding)/universe')}>
      <View style={styles.content}>
        {/* Repeating S1S2 Waveform */}
        <Animated.View entering={FadeIn.delay(500).duration(800)} style={styles.waveformContainer}>
          {[0, 1, 2].map((i) => (
            <Animated.View key={i} entering={FadeIn.delay(500 + i * 600).duration(400)} style={styles.beatGroup}>
              <View style={[styles.peak, { backgroundColor: Colors.s1.primary, height: 36 }]} />
              <View style={[styles.gap]} />
              <View style={[styles.peak, { backgroundColor: Colors.s2.primary, height: 24 }]} />
              {i < 2 && <View style={styles.restLine} />}
            </Animated.View>
          ))}
        </Animated.View>

        {/* Text */}
        <Animated.View entering={FadeInDown.delay(2400).duration(800)} style={styles.textBlock}>
          <Text style={styles.title}>
            Together, they're the sound your heart has made{' '}
            <Text style={styles.emphasis}>every moment</Text>
            {' '}of your life.
          </Text>
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(3200).duration(500)} style={styles.hint}>
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
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxl,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  beatGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  peak: {
    width: 4,
    borderRadius: 2,
  },
  gap: {
    width: 6,
  },
  restLine: {
    width: 24,
    height: 2,
    backgroundColor: Colors.space.nebula,
    marginLeft: 4,
  },
  textBlock: {
    maxWidth: 300,
  },
  title: {
    color: Colors.text.primary,
    fontSize: FontSize.xl,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 32,
  },
  emphasis: {
    fontWeight: '600',
    color: Colors.text.primary,
  },
  hint: {
    position: 'absolute',
    bottom: 60,
    color: Colors.text.muted,
    fontSize: FontSize.sm,
  },
});
