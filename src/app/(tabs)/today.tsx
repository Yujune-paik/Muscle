import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ExerciseRow, HeroWorkoutCard, ProteinCard } from '@/components/cards';
import { IconButton, Screen } from '@/components/primitives';
import { exerciseById, programs } from '@/content';
import { colors, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function TodayScreen() {
  const profile = useAppStore((state) => state.profile);
  const activeSession = useAppStore((state) => state.activeSession);
  const proteinLogs = useAppStore((state) => state.proteinLogs);
  const startWorkout = useAppStore((state) => state.startWorkout);
  const logProtein = useAppStore((state) => state.logProtein);
  const currentProgram = programs[0]!;
  const firstExercise = exerciseById[activeSession?.items[activeSession.currentItemIndex]?.exerciseId ?? currentProgram.exerciseIds[0]!]!;
  const todayLog = proteinLogs.find((log) => log.localDate === localDateKey());

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
      <HeroWorkoutCard
        title={activeSession?.title ?? currentProgram.name}
        metadata={`${activeSession?.items.length ?? currentProgram.exerciseIds.length}種目 · 約${activeSession?.estimatedMinutes ?? currentProgram.estimatedMinutes}分`}
        onPlay={enterWorkout}
        onPress={openOverview}
        resume={Boolean(activeSession && activeSession.status !== 'completed')}
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{activeSession ? '続きから' : '次にやること'}</Text>
        <Text style={styles.sectionLink} onPress={openOverview}>メニューを見る</Text>
      </View>
      <ExerciseRow exercise={firstExercise} index={(activeSession?.currentItemIndex ?? 0) + 1} onPress={enterWorkout} />
      {profile.proteinMode !== 'off' ? (
        <View style={{ marginTop: spacing.section }}>
          <ProteinCard grams={profile.proteinGrams} completed={Boolean(todayLog)} completedAt={todayLog?.completedAt} onLog={logProtein} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 94, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { ...typography.caption, color: colors.textSecondary },
  greeting: { ...typography.heading, color: colors.textPrimary, marginTop: 5 },
  sectionHeader: { marginTop: spacing.major, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...typography.heading, color: colors.textPrimary },
  sectionLink: { ...typography.label, color: colors.textSecondary, paddingVertical: 10 },
});

