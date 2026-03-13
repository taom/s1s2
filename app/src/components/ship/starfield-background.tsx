import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * Starfield Background
 *
 * A subtle animated star field for the Bridge screen.
 * TODO: Replace with Skia canvas for actual parallax star rendering.
 *
 * For now, uses simple positioned dots with varying opacity.
 */

// Deterministic "random" positions for consistent rendering
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 100),
  y: ((i * 53 + 7) % 100),
  size: (i % 3) + 1,
  opacity: 0.2 + (i % 5) * 0.15,
  color: i % 11 === 0 ? Colors.s1.light : i % 7 === 0 ? Colors.s2.light : Colors.text.primary,
}));

export function StarfieldBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      {STARS.map((star) => (
        <View
          key={star.id}
          style={[
            styles.star,
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              backgroundColor: star.color,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    borderRadius: 99,
  },
});
