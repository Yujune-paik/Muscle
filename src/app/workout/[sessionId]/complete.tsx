import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ProteinCard } from '@/components/cards';
import { MuscleHeatmap } from '@/components/progress/muscle-heatmap';
import { PrimaryButton, Screen } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { calculateMuscleStimulus } from '@/domain/stimulus';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function WorkoutCompleteScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const active = useAppStore((state) => state.activeSession);
  const sessions = useAppStore((state) => state.completedSessions);
  const archived = sessions.find((session) => session.id === sessionId);
  const profile = useAppStore((state) => state.profile);
  const proteinLogs = useAppStore((state) => state.proteinLogs);
  const xpEvent = useAppStore((state) => state.xpEvents.find((event) => event.sourceId === `workout-${sessionId}`));
  const logProtein = useAppStore((state) => state.logProtein);
  const returnHome = useAppStore((state) => state.returnHome);
  const session = active?.id === sessionId ? active : archived;
  if (!session) return <Redirect href="/(tabs)/today" />;
  const completedSets = session.items.reduce((sum, item) => sum + item.completedSets, 0);
  const plannedSets = session.items.reduce((sum, item) => sum + item.plannedSets, 0);
  const endedAt = new Date(session.completedAt ?? session.startedAt).getTime();
  const duration = Math.max(1, Math.round((endedAt - new Date(session.startedAt).getTime()) / 60_000));
  const todayLogs = proteinLogs.filter((log) => log.localDate === localDateKey());
  const proteinPlan = calculateProteinPlan(profile);
  const history = sessions.filter((entry) => entry.id !== session.id);
  const stimulus = calculateMuscleStimulus(session, history, profile);
  const home = () => { returnHome(); router.replace('/(tabs)/today'); };
  return (
    <Screen contentStyle={styles.content} testID="complete-screen">
      <View style={styles.completeIcon}><MaterialCommunityIcons name="check-bold" size={35} color={colors.onAccent} /></View>
      <Text style={styles.eyebrow}>SESSION COMPLETE</Text>
      <Text style={styles.title}>今日の積み上げ、完了。</Text>
      <View style={styles.xpReward}><MaterialCommunityIcons name="star-four-points" size={24} color={colors.accent} /><Text style={styles.xpValue}>+{xpEvent?.xp ?? 0} XP</Text><Text style={styles.xpMeta}>成長パスが進みました</Text></View>
      <View style={styles.metrics}>
        <View style={styles.metric}><Text style={styles.metricValue}>{completedSets}/{plannedSets}</Text><Text style={styles.metricLabel}>セット</Text></View>
        <View style={styles.divider} />
        <View style={styles.metric}><Text style={styles.metricValue}>{duration}</Text><Text style={styles.metricLabel}>分</Text></View>
        <View style={styles.divider} />
        <View style={styles.metric}><Text style={styles.metricValue}>{session.items.filter((item) => item.status === 'completed').length}</Text><Text style={styles.metricLabel}>種目</Text></View>
      </View>
      <Text style={styles.sectionTitle}>今日の筋刺激</Text>
      <View style={styles.body}><MuscleHeatmap stimulus={stimulus} /></View>
      <Text style={styles.summary}>淡い赤から強い赤へ。セット数・努力度・体格・過去の負荷をもとにした相対値です。</Text>
      {profile.proteinMode !== 'off' ? (
        <ProteinCard
          servingGrams={proteinPlan.servingGrams}
          completedServings={todayLogs.length}
          targetServings={proteinPlan.scheduledServings}
          actionTargetGrams={proteinPlan.actionTargetGrams}
          lastCompletedAt={todayLogs.at(-1)?.completedAt}
          onLog={logProtein}
          compact
        />
      ) : null}
      <View style={styles.footer}><PrimaryButton label="ホームへ" onPress={home} /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { minHeight: 980, paddingTop: 40 },
  completeIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.7 },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: 8 },
  xpReward: { minHeight: 64, borderRadius: radii.card, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', marginTop: spacing.section, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 9 },
  xpValue: { ...typography.heading, color: colors.accent },
  xpMeta: { ...typography.caption, color: colors.textSecondary, marginLeft: 'auto' },
  metrics: { minHeight: 96, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { ...typography.heading, color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  metricLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  divider: { width: 1, height: 38, backgroundColor: colors.border },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginTop: spacing.major },
  body: { marginTop: 10, borderRadius: radii.card, backgroundColor: '#111113', borderWidth: 1, borderColor: colors.border, paddingVertical: 10, overflow: 'hidden' },
  summary: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginVertical: spacing.section, paddingHorizontal: 14 },
  footer: { marginTop: 'auto', paddingTop: spacing.section },
});
