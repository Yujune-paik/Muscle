import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ExerciseRow } from '@/components/cards';
import { IconButton, PrimaryButton, Screen, TopBar } from '@/components/primitives';
import { exerciseById } from '@/content';
import { colors, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';

export default function WorkoutOverviewScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const session = useAppStore((state) => state.activeSession);
  const startWorkout = useAppStore((state) => state.startWorkout);
  if (!session || session.id !== sessionId) return <Redirect href="/(tabs)/today" />;
  const begin = () => {
    const current = startWorkout();
    const item = current.items[current.currentItemIndex] ?? current.items[0];
    if (item) router.push(`/workout/${current.id}/exercise/${item.id}`);
  };
  return (
    <Screen contentStyle={styles.content} testID="workout-overview">
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="今日のルート" />
      <Text style={styles.title}>{session.title}</Text>
      <Text style={styles.meta}>{session.items.length}種目 · 約{session.estimatedMinutes}分 · {session.status === 'paused' ? '一時停止中' : '準備できています'}</Text>
      <View style={styles.route}>
        {session.items.map((item, index) => {
          const exercise = exerciseById[item.exerciseId];
          if (!exercise) return null;
          return <ExerciseRow key={item.id} exercise={exercise} status={item.status} index={index + 1} onPress={() => router.push(`/exercise/${exercise.id}`)} />;
        })}
      </View>
      <View style={styles.footer}>
        <PrimaryButton label={session.currentItemIndex > 0 || session.status === 'paused' ? '続きから始める' : 'トレーニングを始める'} icon="play" onPress={begin} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { minHeight: 790 },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  meta: { ...typography.body, color: colors.textSecondary, marginTop: 8 },
  route: { marginTop: spacing.major },
  footer: { marginTop: 'auto', paddingTop: spacing.major },
});

