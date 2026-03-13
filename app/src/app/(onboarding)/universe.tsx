import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import Animated, { FadeIn, FadeInUp, SlideInUp } from 'react-native-reanimated';

/**
 * Onboarding Screen 4 — The Universe
 *
 * The S1S2 waveform peaks explode outward like a big bang, becoming stars.
 * Camera pulls back to reveal a galaxy generated from the waveform.
 * Text: "Let's turn that sound into a universe."
 * Button: "Begin" (styled as a ship ignition switch)
 */
export default function OnboardingUniverse() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Star field (placeholder — will be Skia canvas) */}
      <View style={styles.starField}>
        {Array.from({ length: 40 }).map((_, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.delay(800 + i * 50).duration(400)}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 70}%`,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                opacity: Math.random() * 0.7 + 0.3,
                backgroundColor: i % 7 === 0 ? Colors.s1.light : i % 5 === 0 ? Colors.s2.light : Colors.text.primary,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <Animated.Text entering={FadeInUp.delay(2000).duration(800)} style={styles.title}>
          Let's turn that sound into a{' '}
          <Text style={styles.universeAccent}>universe</Text>.
        </Animated.Text>

        <Animated.View entering={SlideInUp.delay(3000).duration(600)}>
          <Pressable
            style={styles.beginButton}
            onPress={() => router.push('/(onboarding)/captain-name')}
          >
            <View style={styles.ignitionOuter}>
              <View style={styles.ignitionInner}>
                <Text style={styles.beginText}>BEGIN</Text>
              </View>
            </View>
            <Text style={styles.beginHint}>Engage engines</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.void,
  },
  starField: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    borderRadius: 99,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 120,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxl,
  },
  title: {
    color: Colors.text.primary,
    fontSize: FontSize.xxl,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 38,
  },
  universeAccent: {
    fontWeight: '700',
    color: Colors.star.gold,
  },
  beginButton: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ignitionOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.s1.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.space.mid,
  },
  ignitionInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: Colors.s2.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.space.surface,
  },
  beginText: {
    color: Colors.text.primary,
    fontSize: FontSize.md,
    fontWeight: '800',
    letterSpacing: 4,
  },
  beginHint: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
  },
});
