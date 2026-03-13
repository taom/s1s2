import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';

/**
 * Creature Discovery Flow (Full Screen Modal)
 *
 * Step 1: Approach — Ship flies toward planet
 * Step 2: Detection — "Unknown acoustic signature detected..."
 * Step 3: Reveal — Creature materializes from light particles
 * Step 4: Field Guide Entry — Name, lore, added confirmation
 *
 * TODO: receive creature data via route params
 */
export default function CreatureDiscoveryScreen() {
  const router = useRouter();

  // Placeholder creature data
  const creature = {
    name: 'First Pulse',
    resonanceClass: 's1' as const,
    rarity: 'common' as const,
    lore: 'The smallest and most fundamental of all resonance creatures. It appears the moment a new captain makes their first recording — as if drawn by the sound of intention itself.',
    fieldNotes: 'Resting heart rate is your heart\'s baseline rhythm. The First Pulse appears to celebrate the beginning of your measurement journey.',
  };

  return (
    <View style={styles.container}>
      {/* Particle Background */}
      <View style={styles.particleField}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.delay(1500 + i * 100).duration(600)}
            style={[
              styles.particle,
              {
                left: `${30 + Math.random() * 40}%`,
                top: `${20 + Math.random() * 30}%`,
                backgroundColor: i % 2 === 0 ? Colors.s1.light : Colors.star.gold,
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
              },
            ]}
          />
        ))}
      </View>

      {/* Detection Text */}
      <Animated.Text entering={FadeIn.delay(500).duration(800)} style={styles.detectionText}>
        Unknown acoustic signature detected...
      </Animated.Text>

      {/* Creature Reveal */}
      <Animated.View entering={ZoomIn.delay(2000).duration(1000)} style={styles.creatureReveal}>
        <View style={[styles.creatureFrame, { borderColor: Colors.s1.primary }]}>
          <Text style={styles.creatureIcon}>🔥</Text>
        </View>
        {/* Rarity Badge */}
        <View style={[styles.rarityBadge, { backgroundColor: Colors.rarity.common }]}>
          <Text style={styles.rarityText}>COMMON</Text>
        </View>
        {/* Resonance Class */}
        <View style={[styles.classBadge, { backgroundColor: Colors.s1.muted }]}>
          <Text style={[styles.classText, { color: Colors.s1.primary }]}>S1 · INITIATOR</Text>
        </View>
      </Animated.View>

      {/* Name + Lore */}
      <Animated.View entering={FadeInUp.delay(3000).duration(600)} style={styles.infoSection}>
        <Text style={styles.creatureName}>{creature.name}</Text>
        <Text style={styles.loreText}>{creature.lore}</Text>
        <View style={styles.divider} />
        <Text style={styles.fieldNotesLabel}>FIELD NOTES</Text>
        <Text style={styles.fieldNotesText}>{creature.fieldNotes}</Text>
      </Animated.View>

      {/* Confirmation */}
      <Animated.View entering={FadeInUp.delay(3600).duration(600)} style={styles.footer}>
        <Text style={styles.addedText}>Added to your Acoustic Field Guide</Text>
        <Pressable style={styles.continueButton} onPress={() => router.back()}>
          <Text style={styles.continueText}>Your universe grows.</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space.void,
    alignItems: 'center',
    paddingTop: 80,
  },
  particleField: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    borderRadius: 99,
    opacity: 0.6,
  },

  detectionText: {
    color: Colors.text.muted,
    fontSize: FontSize.sm,
    letterSpacing: 1,
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
  },

  creatureReveal: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  creatureFrame: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    backgroundColor: Colors.space.mid,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  creatureIcon: {
    fontSize: 56,
  },
  rarityBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  rarityText: {
    color: Colors.space.void,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 2,
  },
  classBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  classText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },

  infoSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  creatureName: {
    color: Colors.text.primary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  loreText: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.space.surface,
    marginVertical: Spacing.sm,
  },
  fieldNotesLabel: {
    color: Colors.text.muted,
    fontSize: FontSize.xs,
    letterSpacing: 2,
  },
  fieldNotesText: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
  },

  footer: {
    marginTop: 'auto',
    paddingBottom: 60,
    alignItems: 'center',
    gap: Spacing.md,
  },
  addedText: {
    color: Colors.star.gold,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  continueButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  continueText: {
    color: Colors.text.secondary,
    fontSize: FontSize.md,
    fontStyle: 'italic',
  },
});
