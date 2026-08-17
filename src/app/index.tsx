import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';

export default function BootstrapScreen() {
  const hydrated = useAppStore((state) => state.hydrated);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const activeSession = useAppStore((state) => state.activeSession);

  if (!hydrated) {
    return (
      <View style={styles.root}>
        <Text style={styles.wordmark}>NXTSET</Text>
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      </View>
    );
  }

  if (!onboardingCompleted) return <Redirect href="/(onboarding)/welcome" />;
  if (activeSession?.status === 'completed') return <Redirect href={`/workout/${activeSession.id}/complete`} />;
  return <Redirect href="/(tabs)/today" />;
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  wordmark: { ...typography.title, color: colors.textPrimary, letterSpacing: 5 },
  loader: { marginTop: 24 },
});

