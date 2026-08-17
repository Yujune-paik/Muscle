import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ProteinCard } from '@/components/cards';
import { BodyMap } from '@/components/media/exercise-motion';
import { PrimaryButton, Screen } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function WorkoutCompleteScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const active = useAppStore((state) => state.activeSession);
  const archived = useAppStore((state) => state.completedSessions.find((session) => session.id === sessionId));
  const profile = useAppStore((state) => state.profile);
  const proteinLogs = useAppStore((state) => state.proteinLogs);
  const logProtein = useAppStore((state) => state.logProtein);
  const returnHome = useAppStore((state) => state.returnHome);
  const session = active?.id === sessionId ? active : archived;
  if (!session) return <Redirect href="/(tabs)/today" />;
  const completed = session.items.filter((item) => item.status === 'completed').length;
  const improved = session.items.filter((item) => item.difficulty === 'easy' || item.difficulty === 'good').length;
  const endedAt = new Date(session.completedAt ?? session.startedAt).getTime();
  const duration = Math.max(1, Math.round((endedAt - new Date(session.startedAt).getTime()) / 60_000));
  const todayProtein = proteinLogs.find((log) => log.localDate === localDateKey());
  const home = () => {
    returnHome();
    router.replace('/(tabs)/today');
  };
  return (
    <Screen contentStyle={styles.content} testID="complete-screen">
      <Text style={styles.eyebrow}>SESSION COMPLETE</Text>
      <Text style={styles.title}>今日の{`\n`}トレーニング完了</Text>
      <View style={styles.metrics}>
        <View style={styles.metric}><Text style={styles.metricValue}>{completed}/{session.items.length}</Text><Text style={styles.metricLabel}>種目</Text></View>
        <View style={styles.divider} />
        <View style={styles.metric}><Text style={styles.metricValue}>{duration}</Text><Text style={styles.metricLabel}>分</Text></View>
        <View style={styles.divider} />
        <View style={styles.metric}><Text style={styles.metricValue}>{improved}</Text><Text style={styles.metricLabel}>前進候補</Text></View>
      </View>
      <View style={styles.body}><BodyMap muscles={['chest', 'back', 'legs', 'shoulders']} /></View>
      <Text style={styles.summary}>胸・背中・脚・肩を、一つずつ迷わず終えました。</Text>
      {profile.proteinMode !== 'off' ? (
        <ProteinCard grams={profile.proteinGrams} completed={Boolean(todayProtein)} completedAt={todayProtein?.completedAt} onLog={logProtein} compact />
      ) : null}
      <View style={styles.footer}><PrimaryButton label="ホームへ" onPress={home} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { minHeight: 790, paddingTop: 48 },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.7 },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: 10 },
  metrics: { minHeight: 96, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', marginTop: spacing.section },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { ...typography.heading, color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  metricLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  divider: { width: 1, height: 38, backgroundColor: colors.border },
  body: { height: 260, marginTop: 4 },
  summary: { ...typography.body, color: colors.textPrimary, fontWeight: '600', textAlign: 'center', marginBottom: spacing.section },
  footer: { marginTop: 'auto', paddingTop: spacing.section },
});
