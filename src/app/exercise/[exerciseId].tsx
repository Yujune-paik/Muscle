import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ExerciseMotion } from '@/components/media/exercise-motion';
import { IconButton, Screen, TopBar } from '@/components/primitives';
import { MuscleLabel, PrescriptionChip } from '@/components/workout';
import { exerciseById } from '@/content';
import { rankReplacements } from '@/domain/replacement';
import { colors, radii, spacing, typography } from '@/design/tokens';

export default function ExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exercise = exerciseById[exerciseId];
  if (!exercise) return <Redirect href="/(tabs)/profile" />;
  const alternatives = rankReplacements(exercise.id, {}).slice(0, 2);
  return (
    <Screen>
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="種目" />
      <ExerciseMotion exercise={exercise} />
      <Text style={styles.title}>{exercise.name}</Text>
      <MuscleLabel label={exercise.target} />
      <View style={styles.prescriptions}>
        <PrescriptionChip value={exercise.weight ?? '自重'} unit={exercise.weight === null ? '' : 'kg'} editable={false} />
        <PrescriptionChip value={exercise.reps} unit="回" editable={false} />
        <PrescriptionChip value={exercise.sets} unit="セット" editable={false} />
      </View>
      <View style={styles.cueCard}>
        <Text style={styles.sectionLabel}>セットアップ</Text>
        {exercise.cues.map((cue, index) => <Text style={styles.cue} key={cue}>{index + 1}. {cue}</Text>)}
      </View>
      {alternatives.length ? (
        <View style={styles.altSection}>
          <Text style={styles.sectionLabel}>よく使う代替</Text>
          {alternatives.map((alt) => <Text style={styles.altText} key={alt.exercise.id}>{alt.exercise.name} · {alt.reason}</Text>)}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.textPrimary, marginTop: spacing.section, marginBottom: 8 },
  prescriptions: { flexDirection: 'row', gap: 8, marginTop: spacing.section },
  cueCard: { marginTop: spacing.section, borderRadius: radii.card, backgroundColor: colors.surface, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 8 },
  sectionLabel: { ...typography.caption, color: colors.textSecondary, letterSpacing: 1 },
  cue: { ...typography.body, color: colors.textPrimary },
  altSection: { marginTop: spacing.section, gap: 8 },
  altText: { ...typography.body, color: colors.textSecondary },
});

