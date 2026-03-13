import { Redirect } from 'expo-router';

/**
 * Root index — redirects to onboarding or main tabs
 * based on whether the user has completed onboarding.
 *
 * TODO: read onboarding state from local DB
 */
export default function Index() {
  const hasCompletedOnboarding = false; // TODO: from store

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)/bridge" />;
  }

  return <Redirect href="/(onboarding)" />;
}
