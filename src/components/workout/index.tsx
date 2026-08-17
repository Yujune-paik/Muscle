import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/design/tokens';
import type { Difficulty } from '@/types';

export function MuscleLabel({ label }: { label: string }) {
  return (
    <View style={styles.muscleLabel}>
      <View style={styles.muscleDot} />
      <Text style={styles.muscleText}>主に{label}</Text>
    </View>
  );
}

export function PrescriptionChip({
  value,
  unit,
  onPress,
  editable = true,
}: {
  value: string | number;
  unit: string;
  onPress?: () => void;
  editable?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={editable ? 'button' : 'text'}
      accessibilityLabel={`${value}${unit}${editable ? '、変更' : ''}`}
      disabled={!editable}
      onPress={onPress}
      style={({ pressed }) => [styles.prescription, pressed && { opacity: 0.7 }]}>
      <Text style={styles.prescriptionValue}>{value}</Text>
      <Text style={styles.prescriptionUnit}>{unit}</Text>
      {editable ? <MaterialCommunityIcons name="chevron-down" size={14} color={colors.textMuted} /> : null}
    </Pressable>
  );
}

export function SetProgress({ completed, total }: { completed: number; total: number }) {
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: completed }} style={styles.setProgress}>
      {Array.from({ length: total }).map((_, index) => (
        <View key={index} style={[styles.setDot, index < completed && styles.setDotComplete]}>
          {index < completed ? <MaterialCommunityIcons name="check" size={14} color={colors.onAccent} /> : <Text style={styles.setDotText}>{index + 1}</Text>}
        </View>
      ))}
    </View>
  );
}

export function RestTimerBar({
  endAt,
  onSkip,
  onExtend,
}: {
  endAt: number;
  onSkip: () => void;
  onExtend: () => void;
}) {
  const [now, setNow] = useState(endAt);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [endAt]);
  const remaining = Math.max(0, Math.ceil((endAt - now) / 1000));
  const label = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;

  return (
    <View accessibilityLiveRegion="polite" style={styles.timerBar}>
      <View style={styles.timerCopy}>
        <Text style={styles.timerLabel}>休憩</Text>
        <Text style={styles.timerValue}>{label}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="30秒追加" onPress={onExtend} style={styles.timerAction}>
        <Text style={styles.timerActionText}>+30秒</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="休憩を終えて次へ" onPress={onSkip} style={styles.timerNext}>
        <Text style={styles.timerNextText}>次へ</Text>
      </Pressable>
    </View>
  );
}

const difficultyContent: Record<Difficulty, { title: string; subtitle: string; icon: 'feather' | 'check' | 'weather-lightning' }> = {
  easy: { title: '余裕だった', subtitle: 'まだ数回できそう', icon: 'feather' },
  good: { title: 'ちょうどよかった', subtitle: '最後まで形を保てた', icon: 'check' },
  hard: { title: 'きつすぎた', subtitle: '回数不足・大きく崩れた', icon: 'weather-lightning' },
};

export function DifficultyChoice({ value, onPress }: { value: Difficulty; onPress: (value: Difficulty) => void }) {
  const content = difficultyContent[value];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${content.title}、${content.subtitle}`}
      onPress={() => onPress(value)}
      style={({ pressed }) => [styles.difficulty, pressed && styles.difficultyPressed]}>
      <View style={styles.difficultyIcon}>
        <MaterialCommunityIcons name={content.icon} size={22} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.difficultyTitle}>{content.title}</Text>
        <Text style={styles.difficultySubtitle}>{content.subtitle}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

export function RouteProgress({ current, total }: { current: number; total: number }) {
  const width = useMemo(() => `${Math.min(100, Math.max(0, (current / total) * 100))}%` as const, [current, total]);
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: current }} style={styles.routeTrack}>
      <View style={[styles.routeFill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  muscleLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  muscleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.muscle },
  muscleText: { ...typography.label, color: colors.textSecondary },
  prescription: {
    flex: 1,
    minHeight: 70,
    borderRadius: radii.compact,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  prescriptionValue: { ...typography.title, color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  prescriptionUnit: { ...typography.caption, color: colors.textSecondary, marginTop: 5 },
  setProgress: { flexDirection: 'row', gap: spacing.compact, justifyContent: 'center' },
  setDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setDotComplete: { backgroundColor: colors.accent, borderColor: colors.accent },
  setDotText: { ...typography.caption, color: colors.textSecondary },
  timerBar: {
    minHeight: 64,
    borderRadius: radii.card,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerCopy: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  timerLabel: { ...typography.caption, color: colors.textSecondary },
  timerValue: { ...typography.heading, color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  timerAction: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 10 },
  timerActionText: { ...typography.caption, color: colors.textSecondary },
  timerNext: { minHeight: 44, paddingHorizontal: 18, justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.accent },
  timerNextText: { ...typography.label, color: colors.onAccent },
  difficulty: {
    minHeight: 84,
    padding: spacing.standard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.related,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
  },
  difficultyPressed: { borderColor: colors.accent, transform: [{ scale: 0.99 }] },
  difficultyIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2A2F20', alignItems: 'center', justifyContent: 'center' },
  difficultyTitle: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  difficultySubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  routeTrack: { width: '100%', height: 3, borderRadius: 2, backgroundColor: colors.border, overflow: 'hidden' },
  routeFill: { height: '100%', backgroundColor: colors.accent },
});
