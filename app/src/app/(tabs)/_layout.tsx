import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

/**
 * Main tab navigation — the ship's interior rooms.
 *
 * Bridge (Home) | Chamber | Galaxy | Signal Deck | The Log
 *
 * The tab bar is styled as a ship console strip at the bottom.
 */

// Minimal icon components (placeholders — will be replaced with custom SVG icons)
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const char = label[0];
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <View style={[styles.iconDot, { backgroundColor: focused ? Colors.s1.primary : Colors.text.muted }]} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.s1.primary,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="bridge"
        options={{
          title: 'Bridge',
          tabBarIcon: ({ focused }) => <TabIcon label="Bridge" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chamber"
        options={{
          title: 'Chamber',
          tabBarIcon: ({ focused }) => <TabIcon label="Chamber" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="galaxy"
        options={{
          title: 'Galaxy',
          tabBarIcon: ({ focused }) => <TabIcon label="Galaxy" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="signals"
        options={{
          title: 'Signals',
          tabBarIcon: ({ focused }) => <TabIcon label="Signals" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'The Log',
          tabBarIcon: ({ focused }) => <TabIcon label="Log" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.space.mid,
    borderTopColor: Colors.space.surface,
    borderTopWidth: 1,
    height: 72,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFocused: {
    opacity: 1,
  },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
