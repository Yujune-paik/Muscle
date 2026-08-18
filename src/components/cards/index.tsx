import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import type { Exercise } from '@/types';

export function HeroWorkoutCard({
  title,
  metadata,
  onPlay,
  onPress,
  resume = false,
  imageUri,
}: {
  title: string;
  metadata: string;
  onPlay: () => void;
  onPress: () => void;
  resume?: boolean;
  imageUri?: string;
}) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroAura} />
      {imageUri ? <Image source={{ uri: imageUri }} accessibilityLabel={`${title} 最初の種目`} style={styles.heroArtwork} contentFit="cover" cachePolicy="memory-disk" /> : null}
      <View style={styles.heroImageScrim} />
      <View style={styles.heroTopRow}>
        <Text style={styles.heroEyebrow}>{resume ? 'RESUME' : 'TODAY'}</Text>
        <View style={styles.heroBadge}>
          <View style={styles.heroBadgeDot} />
          <Text style={styles.heroBadgeText}>Demo Gym</Text>
        </View>
      </View>
      <View style={styles.heroBottom}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroMeta}>{metadata}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}、${metadata}、メニューを見る`}
        onPress={onPress}
        style={({ pressed }) => [styles.heroHitArea, pressed && styles.heroPressed]}
      />
      <View style={styles.playButton}>
        <IconButton icon={resume ? 'play' : 'arrow-right'} label={resume ? '続きを始める' : 'トレーニングを始める'} onPress={onPlay} accent size={64} />
      </View>
    </View>
  );
}

export function ExerciseRow({
  exercise,
  status,
  index,
  onPress,
}: {
  exercise: Exercise;
  status?: 'pending' | 'active' | 'completed' | 'skipped';
  index?: number;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${exercise.name}、主に${exercise.target}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.exerciseRow, pressed && { opacity: 0.7 }]}>
      <View style={[styles.exerciseThumb, status === 'completed' && styles.exerciseThumbDone]}>
        {status === 'completed' ? (
          <MaterialCommunityIcons name="check" size={20} color={colors.onAccent} />
        ) : (
          <Text style={styles.exerciseIndex}>{index ?? '01'}</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseTarget}>主に{exercise.target} · {exercise.sets}セット</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

export function ProteinCard({
  servingGrams,
  completedServings,
  targetServings,
  actionTargetGrams,
  lastCompletedAt,
  onLog,
  compact = false,
}: {
  servingGrams: number;
  completedServings: number;
  targetServings: number;
  actionTargetGrams: number | null;
  lastCompletedAt?: string;
  onLog: () => void;
  compact?: boolean;
}) {
  const completed = completedServings >= targetServings;
  const time = lastCompletedAt ? new Date(lastCompletedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <View style={[styles.protein, compact && { minHeight: 84 }]}>
      <View style={styles.proteinIcon}>
        <MaterialCommunityIcons name="cup-water" size={23} color={completed ? colors.accent : colors.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.proteinTitle}>{targetServings === 0 ? '今日は食事を中心に' : completed ? '今日の補助プラン達成' : `次の1杯 · ${servingGrams}g`}</Text>
        <Text style={styles.proteinMeta}>
          {targetServings === 0
            ? `食事込み目標${actionTargetGrams ? ` ${actionTargetGrams}g` : 'は個別確認'} · 不足時だけ補助`
            : completed
            ? `${completedServings}/${targetServings}杯${time ? ` · ${time}に記録` : ''}`
            : `${completedServings}/${targetServings}杯 · 食事込み目標${actionTargetGrams ? ` ${actionTargetGrams}g` : 'は個別確認'}`}
        </Text>
      </View>
      {!completed && targetServings > 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`${servingGrams}グラムのプロテインを飲んだ`} onPress={() => onLog()} style={styles.proteinAction}>
          <Text style={styles.proteinActionText}>飲んだ</Text>
        </Pressable>
      ) : targetServings > 0 ? (
        <MaterialCommunityIcons name="check-circle" size={25} color={colors.accent} />
      ) : <MaterialCommunityIcons name="food-apple-outline" size={25} color={colors.accent} />}
    </View>
  );
}

export function WeeklySummaryCard({ completed, target }: { completed: number; target: number }) {
  return (
    <View style={styles.weekly}>
      <View>
        <Text style={styles.weeklyLabel}>今週のトレーニング</Text>
        <Text style={styles.weeklyValue}>{target}回中{completed}回できました</Text>
      </View>
      <View style={styles.weeklyDots}>
        {Array.from({ length: target }).map((_, index) => (
          <View key={index} style={[styles.weeklyDot, index < completed && styles.weeklyDotDone]}>
            {index < completed ? <MaterialCommunityIcons name="check" size={16} color={colors.onAccent} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export function AlternativeExerciseCard({
  exercise,
  reason,
  onSelect,
}: {
  exercise: Exercise;
  reason: string;
  onSelect: () => void;
}) {
  return (
    <View style={styles.alternative}>
      <View style={styles.altVisual}>
        <MaterialCommunityIcons name="dumbbell" size={32} color={colors.textSecondary} />
      </View>
      <View style={styles.altCopy}>
        <Text style={styles.altName}>{exercise.name}</Text>
        <Text style={styles.altTarget}>主に{exercise.target}</Text>
        <Text style={styles.altReason}>{reason}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`${exercise.name}に変える`} onPress={onSelect} style={styles.altAction}>
        <Text style={styles.altActionText}>これに変える</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 410,
    borderRadius: 28,
    backgroundColor: '#17191A',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    padding: spacing.section,
  },
  heroAura: { position: 'absolute', right: -70, top: 10, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(215,255,74,0.07)' },
  heroArtwork: { position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.58 },
  heroImageScrim: { position: 'absolute', inset: 0, backgroundColor: 'rgba(8,8,9,0.34)' },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroEyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.8 },
  heroBadge: { flexDirection: 'row', gap: 7, alignItems: 'center', backgroundColor: 'rgba(10,10,11,0.62)', paddingHorizontal: 10, paddingVertical: 7, borderRadius: radii.pill },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  heroBadgeText: { ...typography.caption, color: colors.textSecondary },
  heroBottom: { marginTop: 'auto', maxWidth: 250 },
  heroTitle: { ...typography.displayL, color: colors.textPrimary },
  heroMeta: { ...typography.body, color: colors.textSecondary, marginTop: 5 },
  heroHitArea: { position: 'absolute', inset: 0, zIndex: 1, borderRadius: 28 },
  heroPressed: { backgroundColor: 'rgba(255,255,255,0.035)' },
  playButton: { position: 'absolute', right: 22, bottom: 22, zIndex: 2 },
  exerciseRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12 },
  exerciseThumb: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  exerciseThumbDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  exerciseIndex: { ...typography.caption, color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  exerciseName: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  exerciseTarget: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  protein: { minHeight: 96, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  proteinIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  proteinTitle: { ...typography.label, color: colors.textPrimary },
  proteinMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  proteinAction: { minHeight: 44, minWidth: 76, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.accent },
  proteinActionText: { ...typography.label, color: colors.onAccent },
  weekly: { minHeight: 150, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 20, justifyContent: 'space-between' },
  weeklyLabel: { ...typography.caption, color: colors.textSecondary },
  weeklyValue: { ...typography.heading, color: colors.textPrimary, marginTop: 8 },
  weeklyDots: { flexDirection: 'row', gap: 10 },
  weeklyDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  weeklyDotDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  alternative: { borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  altVisual: { height: 120, backgroundColor: '#1D1D20', alignItems: 'center', justifyContent: 'center' },
  altCopy: { paddingHorizontal: 16, paddingTop: 16 },
  altName: { ...typography.heading, color: colors.textPrimary },
  altTarget: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  altReason: { ...typography.body, color: colors.textPrimary, marginTop: 14 },
  altAction: { minHeight: 52, margin: 16, marginTop: 18, borderRadius: radii.pill, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  altActionText: { ...typography.label, color: colors.onAccent },
});
