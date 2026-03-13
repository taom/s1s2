import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius } from '@/constants/theme';
import Animated, { FadeIn, FadeInUp, BounceIn } from 'react-native-reanimated';

/**
 * Setup Screen 3 — Ship Ready
 * "Your ship is ready."
 *
 * Ship appears with engine glowing at measured HR.
 * Galaxy map fades in with the first system highlighted.
 */
export default function ShipReadyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Ship Visualization */}
      <View style={styles.shipArea}>
        <Animated.View entering={BounceIn.delay(500).duration(800)} style={styles.shipVisual}>
          <View style={styles.shipBody}>
            <View style={styles.porthole} />
            <View style={styles.engineGlow} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.textArea}>
        <Animated.Text entering={FadeInUp.delay(1200).duration(600)} style={styles.title}>
          Your ship is ready.
        </Animated.Text>

        <Animated.Text entering={FadeIn.delay(1800).duration(600)} style={styles.subtitle}>
          The galaxy awaits, Captain.
        </Animated.Text>

        <Animated.View entering={FadeInUp.delay(2400).duration(600)}>
          <Pressable
            style={styles.launchButton}
            onPress={() => {
              // TODO: mark onboarding complete in store, navigate to tabs
              router.replace('/(tabs)/bridge');
            }}
          >
            <Text style={styles.launchText}>LAUNCH</Text>
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
  shipArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipVisual: {
    alignItems: 'center',
  },
  shipBody: {
    width: 120,
    height: 160,
    backgroundColor: Colors.space.surface,
    borderRadius: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: Colors.space.nebula,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  porthole: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.s2.muted,
    borderWidth: 1,
    borderColor: Colors.s2.primary,
  },
  engineGlow: {
    position: 'absolute',
    bottom: -8,
    width: 40,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.s1.primary,
    opacity: 0.6,
  },
  textArea: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    color: Colors.text.primary,
    fontSize: FontSize.xxl,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.text.secondary,
    fontSize: FontSize.lg,
    fontWeight: '300',
  },
  launchButton: {
    backgroundColor: Colors.s1.primary,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
    marginTop: Spacing.lg,
  },
  launchText: {
    color: Colors.text.primary,
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
