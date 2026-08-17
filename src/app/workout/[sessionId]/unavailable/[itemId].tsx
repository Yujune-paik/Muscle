import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AlternativeExerciseCard } from '@/components/cards';
import { IconButton, Screen, TopBar } from '@/components/primitives';
import { exerciseById } from '@/content';
import { rankReplacements } from '@/domain/replacement';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';
import type { UnavailableReason } from '@/types';

const reasons: { value: UnavailableReason; title: string; subtitle: string; icon: 'account-group-outline' | 'map-marker-remove-outline' | 'skip-next' }[] = [
  { value: 'busy', title: '混んでいる', subtitle: '今日だけ別の器具へ', icon: 'account-group-outline' },
  { value: 'absent', title: 'このジムにはない', subtitle: 'ジム情報にも保存', icon: 'map-marker-remove-outline' },
  { value: 'skip', title: '今日は飛ばす', subtitle: '部分的な記録として残す', icon: 'skip-next' },
];

export default function UnavailableScreen() {
  const { sessionId, itemId } = useLocalSearchParams<{ sessionId: string; itemId: string }>();
  const session = useAppStore((state) => state.activeSession);
  const equipment = useAppStore((state) => state.equipment);
  const setUnavailableReason = useAppStore((state) => state.setUnavailableReason);
  const replaceExercise = useAppStore((state) => state.replaceExercise);
  const skipExercise = useAppStore((state) => state.skipExercise);
  const [reason, setReason] = useState<Exclude<UnavailableReason, 'skip'> | null>(null);
  if (!session || session.id !== sessionId) return <Redirect href="/(tabs)/today" />;
  const index = session.items.findIndex((item) => item.id === itemId);
  const item = session.items[index];
  const exercise = item ? exerciseById[item.exerciseId] : undefined;
  if (!item || !exercise) return <Redirect href="/(tabs)/today" />;
  const effectiveEquipment = { ...equipment };
  session.busyEquipmentIds.forEach((id) => { effectiveEquipment[id] = 'absent'; });
  const completedIds = session.items.filter((entry) => entry.status === 'completed').map((entry) => entry.exerciseId);
  const alternatives = reason ? rankReplacements(exercise.id, effectiveEquipment, completedIds) : [];

  const chooseReason = (value: UnavailableReason) => {
    if (value === 'skip') {
      skipExercise(item.id);
      const next = session.items[index + 1];
      if (next) router.replace(`/workout/${session.id}/exercise/${next.id}`);
      else router.replace(`/workout/${session.id}/complete`);
      return;
    }
    setUnavailableReason(item.id, value);
    setReason(value);
  };

  return (
    <Screen testID="unavailable-screen">
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title={exercise.name} />
      <Text style={styles.eyebrow}>QUICK REROUTE</Text>
      <Text style={styles.title}>{reason ? '代わりの一台' : '使えない理由は？'}</Text>
      <Text style={styles.subtitle}>{reason ? '同じ動きに近いものを、2件だけ選びました。' : 'これはエラーではありません。すぐ別のルートへ移れます。'}</Text>
      {!reason ? (
        <View style={styles.reasons}>
          {reasons.map((entry) => (
            <Pressable key={entry.value} accessibilityRole="button" accessibilityLabel={`${entry.title}、${entry.subtitle}`} onPress={() => chooseReason(entry.value)} style={({ pressed }) => [styles.reason, pressed && styles.reasonPressed]}>
              <View style={styles.reasonIcon}><MaterialCommunityIcons name={entry.icon} size={24} color={entry.value === 'skip' ? colors.textSecondary : colors.accent} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reasonTitle}>{entry.title}</Text>
                <Text style={styles.reasonSubtitle}>{entry.subtitle}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.alternatives}>
          {alternatives.map((alternative) => (
            <AlternativeExerciseCard
              key={alternative.exercise.id}
              exercise={alternative.exercise}
              reason={alternative.reason}
              onSelect={() => {
                replaceExercise(item.id, alternative.exercise.id, reason);
                router.replace(`/workout/${session.id}/exercise/${item.id}`);
              }}
            />
          ))}
          {alternatives.length === 0 ? <Text style={styles.empty}>安全に近い代替が見つかりませんでした。今日は飛ばして記録できます。</Text> : null}
          <Pressable accessibilityRole="button" onPress={() => setReason(null)} style={styles.changeReason}><Text style={styles.changeReasonText}>理由を選び直す</Text></Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.4, marginTop: spacing.section },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: 8 },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 10 },
  reasons: { marginTop: spacing.major, gap: 10 },
  reason: { minHeight: 88, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  reasonPressed: { borderColor: colors.accent, transform: [{ scale: 0.99 }] },
  reasonIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  reasonTitle: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  reasonSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  alternatives: { marginTop: spacing.major, gap: 14 },
  empty: { ...typography.body, color: colors.textSecondary },
  changeReason: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  changeReasonText: { ...typography.label, color: colors.textSecondary },
});

