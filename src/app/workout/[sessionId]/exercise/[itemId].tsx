import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ExerciseMedia } from '@/components/media/exercise-motion';
import { BottomSheet, IconButton, PrimaryButton, Screen, TopBar } from '@/components/primitives';
import { MuscleLabel, PrescriptionChip, RestTimerBar, RouteProgress, SetProgress } from '@/components/workout';
import { exerciseById } from '@/content';
import { colors, spacing, typography } from '@/design/tokens';
import { tapHaptic } from '@/services/haptics';
import { useAppStore } from '@/state/app-store';

type EditKind = 'weight' | 'reps' | null;

export default function ActiveExerciseScreen() {
  const { sessionId, itemId } = useLocalSearchParams<{ sessionId: string; itemId: string }>();
  const session = useAppStore((state) => state.activeSession);
  const completeSet = useAppStore((state) => state.completeSet);
  const updatePrescription = useAppStore((state) => state.updatePrescription);
  const pauseWorkout = useAppStore((state) => state.pauseWorkout);
  const resumeWorkout = useAppStore((state) => state.resumeWorkout);
  const discardWorkout = useAppStore((state) => state.discardWorkout);
  const clearRest = useAppStore((state) => state.clearRest);
  const extendRest = useAppStore((state) => state.extendRest);
  const [setActive, setSetActive] = useState(false);
  const [editing, setEditing] = useState<EditKind>(null);
  const [pauseOpen, setPauseOpen] = useState(false);

  if (!session || session.id !== sessionId) return <Redirect href="/(tabs)/today" />;
  const index = session.items.findIndex((entry) => entry.id === itemId);
  const item = session.items[index];
  const exercise = item ? exerciseById[item.exerciseId] : undefined;
  if (!item || !exercise) return <Redirect href="/(tabs)/today" />;

  const setNumber = Math.min(item.plannedSets, item.completedSets + 1);
  const handlePrimary = () => {
    if (!setActive) {
      clearRest();
      setSetActive(true);
      return;
    }
    const isLastSet = item.completedSets + 1 >= item.plannedSets;
    completeSet(item.id);
    tapHaptic().catch(() => undefined);
    setSetActive(false);
    if (isLastSet) router.replace(`/workout/${session.id}/feedback/${item.id}`);
  };

  const adjust = (direction: -1 | 1) => {
    if (editing === 'weight') {
      const increment = exercise.increment ?? 1;
      const current = item.plannedWeight ?? 0;
      updatePrescription(item.id, { weight: Math.max(0, current + increment * direction) });
    }
    if (editing === 'reps') updatePrescription(item.id, { reps: Math.max(1, item.plannedReps + direction) });
  };

  return (
    <Screen contentStyle={styles.content} testID="active-exercise">
      <TopBar
        left={<IconButton icon="close" label="トレーニングを閉じる" onPress={() => setPauseOpen(true)} />}
        title={`${index + 1} / ${session.items.length}`}
        right={<Text style={styles.setCount}>{item.completedSets}/{item.plannedSets} SETS</Text>}
      />
      <RouteProgress current={index + 1} total={session.items.length} />
      <View style={styles.motion}><ExerciseMedia exercise={exercise} /></View>
      <View style={styles.exerciseCopy}>
        <Text style={styles.title}>{exercise.name}</Text>
        <MuscleLabel label={exercise.target} />
        <View style={styles.cues}>
          {exercise.cues.map((cue, cueIndex) => (
            <View style={styles.cue} key={cue}>
              <Text style={styles.cueIndex}>0{cueIndex + 1}</Text>
              <Text style={styles.cueText}>{cue}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.prescriptions}>
        <PrescriptionChip value={item.plannedWeight === null ? '自重' : item.plannedWeight} unit={item.plannedWeight === null ? '' : 'kg'} editable={item.plannedWeight !== null} onPress={() => setEditing('weight')} />
        <PrescriptionChip value={item.plannedReps} unit="回" onPress={() => setEditing('reps')} />
        <PrescriptionChip value={item.plannedSets} unit="セット" editable={false} />
      </View>
      <SetProgress completed={item.completedSets} total={item.plannedSets} />
      <View style={styles.actions}>
        {session.restEndAt ? <RestTimerBar endAt={session.restEndAt} onSkip={clearRest} onExtend={() => extendRest(30)} /> : null}
        <PrimaryButton
          label={setActive ? 'セット完了' : `${setNumber}セット目を始める`}
          icon={setActive ? 'check' : 'play'}
          onPress={handlePrimary}
          testID="set-primary"
        />
        <Pressable accessibilityRole="button" onPress={() => router.push(`/workout/${session.id}/unavailable/${item.id}`)} style={styles.unavailable}>
          <MaterialCommunityIcons name="swap-horizontal" size={18} color={colors.textSecondary} />
          <Text style={styles.unavailableText}>この器具が使えない</Text>
        </Pressable>
      </View>

      <BottomSheet visible={editing !== null} title={editing === 'weight' ? '重量を変更' : '回数を変更'} onClose={() => setEditing(null)}>
        <View style={styles.stepperSheet}>
          <Pressable accessibilityRole="button" accessibilityLabel="減らす" onPress={() => adjust(-1)} style={styles.stepperButton}>
            <MaterialCommunityIcons name="minus" size={28} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.stepperValueWrap}>
            <Text style={styles.stepperValue}>{editing === 'weight' ? item.plannedWeight : item.plannedReps}</Text>
            <Text style={styles.stepperUnit}>{editing === 'weight' ? 'kg' : '回'}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="増やす" onPress={() => adjust(1)} style={styles.stepperButton}>
            <MaterialCommunityIcons name="plus" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>
        <Text style={styles.sheetNote}>予定と違ったときだけ変更してください。キーボード入力は不要です。</Text>
        <PrimaryButton label="この内容にする" onPress={() => setEditing(null)} />
      </BottomSheet>

      <BottomSheet visible={pauseOpen} title="ここで止めますか？" onClose={() => setPauseOpen(false)}>
        <View style={styles.pauseActions}>
          <PrimaryButton label="一時停止する" onPress={() => { pauseWorkout(); setPauseOpen(false); router.replace('/(tabs)/today'); }} />
          <Pressable accessibilityRole="button" onPress={() => { resumeWorkout(); setPauseOpen(false); }} style={styles.sheetTextButton}><Text style={styles.sheetText}>続ける</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => { discardWorkout(); setPauseOpen(false); router.replace('/(tabs)/today'); }} style={styles.sheetTextButton}><Text style={styles.destructiveText}>今日の記録を破棄</Text></Pressable>
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 20 },
  setCount: { ...typography.caption, color: colors.textSecondary, textAlign: 'right' },
  motion: { marginTop: 14, marginHorizontal: -4 },
  exerciseCopy: { marginTop: spacing.section },
  title: { ...typography.title, color: colors.textPrimary, marginBottom: 8 },
  cues: { marginTop: 14, gap: 7 },
  cue: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cueIndex: { ...typography.caption, color: colors.accent, width: 20 },
  cueText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  prescriptions: { flexDirection: 'row', gap: 8, marginTop: spacing.section },
  actions: { marginTop: spacing.section, gap: 10 },
  unavailable: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  unavailableText: { ...typography.label, color: colors.textSecondary },
  stepperSheet: { minHeight: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepperButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  stepperValueWrap: { alignItems: 'center' },
  stepperValue: { ...typography.numeric, color: colors.textPrimary },
  stepperUnit: { ...typography.label, color: colors.textSecondary },
  sheetNote: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginBottom: 20 },
  pauseActions: { gap: 8, paddingBottom: 8 },
  sheetTextButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  sheetText: { ...typography.label, color: colors.textPrimary },
  destructiveText: { ...typography.label, color: colors.danger },
});
