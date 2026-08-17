import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppProviders } from '@/components/providers';
import { colors } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function NavigationRoot() {
  const hydrated = useAppStore((state) => state.hydrated);
  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync().catch(() => undefined);
  }, [hydrated]);
  useEffect(() => {
    if (typeof document !== 'undefined') document.title = 'NXTSET — 次の一台だけ、見ればいい。';
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade',
          title: 'NXTSET — 次の一台だけ、見ればいい。',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout/[sessionId]/exercise/[itemId]" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <NavigationRoot />
    </AppProviders>
  );
}
