import { Stack } from 'expo-router';

/**
 * Onboarding stack layout.
 * 4 cinematic screens + 3 setup screens.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#050810' },
        animation: 'fade',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="s2" />
      <Stack.Screen name="together" />
      <Stack.Screen name="universe" />
      <Stack.Screen name="captain-name" />
      <Stack.Screen name="first-scan" />
      <Stack.Screen name="ship-ready" />
    </Stack>
  );
}
