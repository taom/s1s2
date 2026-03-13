import { Redirect } from 'expo-router';
import { useUserStore } from '@/stores/user-store';

export default function Index() {
  const isOnboarded = useUserStore((s) => s.isOnboarded);

  if (isOnboarded) {
    return <Redirect href="/(tabs)/bridge" />;
  }

  return <Redirect href="/(onboarding)" />;
}
