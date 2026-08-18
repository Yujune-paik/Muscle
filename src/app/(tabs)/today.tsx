import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ExerciseRow, HeroWorkoutCard, ProteinCard } from '@/components/cards';
import { IconButton, Screen } from '@/components/primitives';
import { exerciseById } from '@/content';
import { exerciseMediaById } from '@/content/exercise-media';
import { evidenceTips } from '@/content/science';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { calculateMomentum } from '@/domain/momentum';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { selectPersonalizedProgram } from '@/domain/workout';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function TodayScreen() {
  const profile = useAppStore((state) => state.profile);
  const activeSession = useAppStore((state) => state.activeSession);
  const sessions = useAppStore((state) => state.completedSessions);
  const proteinLogs = useAppStore((state) => state.proteinLogs);
  const xpEvents = useAppStore((state) => state.xpEvents);
  const startWorkout = useAppStore((state) => state.startWorkout);
  const logProtein = useAppStore((state) => state.logProtein);
  const currentProgram = selectPersonalizedProgram(profile, sessions.length);
  const firstExercise = exerciseById[activeSession?.items[activeSession.currentItemIndex]?.exerciseId ?? currentProgram.exerciseIds[0]!]!;
  const todayLogs = proteinLogs.filter((log) => log.localDate === localDateKey());
  const proteinPlan = calculateProteinPlan(profile);
  const momentum = calculateMomentum(xpEvents, sessions, profile.weeklyFrequency);
  const recoveryDone = xpEvents.some((event) => event.type === 'recovery_check' && event.localDate === localDateKey());
  const proteinDone = proteinPlan.scheduledServings === 0 || todayLogs.length >= proteinPlan.scheduledServings;
  const tip = evidenceTips[sessions.length % evidenceTips.length]!;

  const enterWorkout = () => {
    const session = startWorkout();
    const item = session.items[session.currentItemIndex] ?? session.items[0];
    if (item) router.push(`/workout/${session.id}/exercise/${item.id}`);
  };

  const openOverview = () => {
    const session = activeSession ?? startWorkout();
    router.push(`/workout/${session.id}`);
  };

  return (
    <Screen testID="today-screen">
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{format(new Date(), 'M月d日 EEEE', { locale: ja })}</Text>
          <Text style={styles.greeting}>今日も、迷わず一台ずつ。</Text>
        </View>
        <IconButton icon="account-outline" label="あなたを開く" onPress={() => router.push('/(tabs)/profile')} />
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/progress')} style={styles.momentumCard}>
        <View style={styles.levelBadge}><Text style={styles.levelNumber}>{momentum.level}</Text></View>
        <View style={styles.momentumCopy}>
          <View style={styles.momentumTop}><Text style={styles.momentumTitle}>LEVEL {momentum.level}</Text><Text style={styles.chain}>🔥 {momentum.chainWeeks}週チェーン</Text></View>
          <View style={styles.xpTrack}><View style={[styles.xpFill, { width: `${(momentum.levelXp / momentum.nextLevelXp) * 100}%` }]} /></View>
          <Text style={styles.xpMeta}>次のレベルまで {momentum.nextLevelXp - momentum.levelXp} XP</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={21} color={colors.textMuted} />
      </Pressable>

      <View style={styles.questRow}>
        <Quest icon="dumbbell" label={`${momentum.thisWeekWorkouts}/${profile.weeklyFrequency}回`} done={momentum.thisWeekWorkouts >= profile.weeklyFrequency} />
        <Quest icon="cup-water" label={proteinPlan.scheduledServings ? `${todayLogs.length}/${proteinPlan.scheduledServings}杯` : '食事中心'} done={proteinDone} />
        <Quest icon="weather-night" label="回復確認" done={recoveryDone} />
      </View>

      <View style={{ marginTop: spacing.section }}>
        <HeroWorkoutCard
          title={activeSession?.title ?? currentProgram.name}
          metadata={`${activeSession?.items.length ?? currentProgram.exerciseIds.length}種目 · 約${activeSession?.estimatedMinutes ?? currentProgram.estimatedMinutes}分`}
          onPlay={enterWorkout}
          onPress={openOverview}
          resume={Boolean(activeSession && activeSession.status !== 'completed')}
          imageUri={exerciseMediaById[firstExercise.id]?.posePair.startUri}
        />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{activeSession ? '続きから' : '最初の種目'}</Text>
        <Text style={styles.sectionLink} onPress={openOverview}>メニューを見る</Text>
      </View>
      <ExerciseRow exercise={firstExercise} index={(activeSession?.currentItemIndex ?? 0) + 1} onPress={enterWorkout} />
      {profile.proteinMode !== 'off' ? (
        <View style={{ marginTop: spacing.section }}>
          <ProteinCard
            servingGrams={proteinPlan.servingGrams}
            completedServings={todayLogs.length}
            targetServings={proteinPlan.scheduledServings}
            actionTargetGrams={proteinPlan.actionTargetGrams}
            lastCompletedAt={todayLogs.at(-1)?.completedAt}
            onLog={logProtein}
          />
        </View>
      ) : null}
      <Pressable accessibilityRole="link" onPress={() => Linking.openURL(tip.sourceUrl)} style={styles.scienceCard}>
        <View style={styles.scienceIcon}><MaterialCommunityIcons name="flask-outline" size={20} color={colors.accent} /></View>
        <View style={{ flex: 1 }}><Text style={styles.scienceLabel}>SCIENCE NOTE</Text><Text style={styles.scienceTitle}>{tip.title}</Text><Text style={styles.scienceBody}>{tip.body}</Text><Text style={styles.scienceSource}>{tip.sourceName} ↗</Text></View>
      </Pressable>
    </Screen>
  );
}

function Quest({ icon, label, done }: { icon: 'dumbbell' | 'cup-water' | 'weather-night'; label: string; done: boolean }) {
  return <View style={[styles.quest, done && styles.questDone]}><MaterialCommunityIcons name={done ? 'check-circle' : icon} size={18} color={done ? colors.onAccent : colors.textSecondary} /><Text style={[styles.questText, done && styles.questTextDone]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  header: { minHeight: 94, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { ...typography.caption, color: colors.textSecondary },
  greeting: { ...typography.heading, color: colors.textPrimary, marginTop: 5 },
  momentumCard: { minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  levelBadge: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  levelNumber: { ...typography.heading, color: colors.onAccent },
  momentumCopy: { flex: 1 },
  momentumTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  momentumTitle: { ...typography.label, color: colors.textPrimary },
  chain: { ...typography.caption, color: colors.textSecondary },
  xpTrack: { height: 7, borderRadius: 4, backgroundColor: colors.surfaceRaised, overflow: 'hidden', marginTop: 8 },
  xpFill: { height: '100%', borderRadius: 4, backgroundColor: colors.accent },
  xpMeta: { ...typography.caption, color: colors.textMuted, marginTop: 5 },
  questRow: { flexDirection: 'row', gap: 7, marginTop: 10 },
  quest: { minHeight: 42, flex: 1, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5, paddingHorizontal: 5 },
  questDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  questText: { ...typography.caption, color: colors.textSecondary },
  questTextDone: { color: colors.onAccent, fontWeight: '800' },
  sectionHeader: { marginTop: spacing.major, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.heading, color: colors.textPrimary },
  sectionLink: { ...typography.label, color: colors.textSecondary, paddingVertical: 10 },
  scienceCard: { marginTop: spacing.section, marginBottom: 8, borderRadius: radii.card, padding: 17, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  scienceIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#2D321F', alignItems: 'center', justifyContent: 'center' },
  scienceLabel: { ...typography.caption, color: colors.accent, letterSpacing: 1.2 },
  scienceTitle: { ...typography.label, color: colors.textPrimary, marginTop: 5 },
  scienceBody: { ...typography.caption, color: colors.textSecondary, marginTop: 7 },
  scienceSource: { ...typography.caption, color: colors.textMuted, marginTop: 9 },
});
