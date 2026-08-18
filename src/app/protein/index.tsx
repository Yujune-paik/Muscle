import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProteinCard } from '@/components/cards';
import { IconButton, PillButton, Screen, TopBar } from '@/components/primitives';
import { evidenceTips } from '@/content/science';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { scheduleProteinReminder } from '@/services/notifications';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function ProteinScreen() {
  const profile = useAppStore((state) => state.profile);
  const logs = useAppStore((state) => state.proteinLogs);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const logProtein = useAppStore((state) => state.logProtein);
  const [message, setMessage] = useState<string>();
  const plan = calculateProteinPlan(profile);
  const todayLogs = logs.filter((log) => log.localDate === localDateKey());
  const week = Array.from({ length: 7 }).map((_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const key = localDateKey(date);
    const count = logs.filter((log) => log.localDate === key).length;
    return { key, count, completed: plan.scheduledServings === 0 || count >= plan.scheduledServings, day: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()] };
  });
  const requestReminder = async () => {
    const result = await scheduleProteinReminder(profile.proteinTiming);
    setMessage(result.scheduled ? '次の1杯をお知らせします。' : result.reason);
  };
  const science = evidenceTips.find((tip) => tip.id === 'protein_total')!;
  return (
    <Screen testID="protein-screen">
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="プロテイン計画" />
      <Text style={styles.title}>食事込みで、1日</Text>
      <Text style={styles.target}>{plan.actionTargetGrams ? `${plan.actionTargetGrams}g` : '個別に確認'}</Text>
      {plan.rangeMinGrams ? <Text style={styles.subtitle}>科学的な目安は {plan.rangeMinGrams}〜{plan.rangeMaxGrams}g。サプリは足りない分だけです。</Text> : <Text style={styles.subtitle}>{plan.explanation}</Text>}
      <View style={{ marginTop: spacing.section }}>
        <ProteinCard servingGrams={plan.servingGrams} completedServings={todayLogs.length} targetServings={plan.scheduledServings} actionTargetGrams={plan.actionTargetGrams} lastCompletedAt={todayLogs.at(-1)?.completedAt} onLog={logProtein} />
      </View>
      <View style={styles.servingsCard}>
        <View style={styles.servingHeader}><Text style={styles.sectionLabel}>今日の補助</Text><Text style={styles.servingTotal}>{todayLogs.reduce((sum, log) => sum + log.grams, 0)} / {plan.plannedSupplementGrams}g</Text></View>
        <View style={styles.cups}>
          {Array.from({ length: Math.max(1, plan.scheduledServings) }).map((_, index) => (
            <View key={index} style={[styles.cup, index < todayLogs.length && styles.cupDone]}>
              <MaterialCommunityIcons name={index < todayLogs.length ? 'check' : 'cup-water'} size={24} color={index < todayLogs.length ? colors.onAccent : colors.textMuted} />
              <Text style={[styles.cupText, index < todayLogs.length && styles.cupTextDone]}>{plan.servingGrams}g</Text>
            </View>
          ))}
        </View>
        <Text style={styles.servingNote}>{plan.explanation}</Text>
      </View>
      <View style={styles.weekCard}>
        <Text style={styles.sectionLabel}>この7日間</Text>
        <View style={styles.weekRow}>{week.map((day) => <View key={day.key} style={styles.dayWrap}><View style={[styles.dayDot, day.completed && styles.dayDone]}>{day.completed ? <MaterialCommunityIcons name="check" size={15} color={colors.onAccent} /> : <Text style={styles.dayCount}>{day.count}</Text>}</View><Text style={styles.dayLabel}>{day.day}</Text></View>)}</View>
      </View>
      <View style={styles.planCard}>
        <Text style={styles.sectionLabel}>記録しやすいタイミング</Text>
        <Text style={styles.timingHelp}>運動直後に限定する必要はありません。1日の合計を優先します。</Text>
        <View style={styles.pills}>{(['post_workout', 'morning', 'evening'] as const).map((timing) => <PillButton key={timing} label={{ post_workout: '運動後', morning: '朝', evening: '夜' }[timing]} selected={profile.proteinTiming === timing} onPress={() => updateProfile({ proteinTiming: timing })} />)}</View>
        <Pressable accessibilityRole="button" onPress={requestReminder} style={styles.reminder}><MaterialCommunityIcons name="bell-outline" size={19} color={colors.accent} /><Text style={styles.reminderText}>通知を設定する</Text></Pressable>
        {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
      </View>
      <Pressable accessibilityRole="link" onPress={() => Linking.openURL(science.sourceUrl)} style={styles.science}><MaterialCommunityIcons name="book-open-variant" size={20} color={colors.accent} /><View style={{ flex: 1 }}><Text style={styles.scienceTitle}>{science.title}</Text><Text style={styles.scienceBody}>{science.body}</Text><Text style={styles.scienceSource}>{science.sourceName} ↗</Text></View></Pressable>
      <Text style={styles.disclaimer}>健康状態や食事制限がある場合は、この数値より医師・管理栄養士の指示を優先してください。</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.heading, color: colors.textPrimary, marginTop: spacing.section },
  target: { ...typography.displayXL, color: colors.accent, marginTop: 2 },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 8 },
  sectionLabel: { ...typography.caption, color: colors.textSecondary },
  servingsCard: { marginTop: spacing.section, borderRadius: radii.card, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', padding: 18 },
  servingHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  servingTotal: { ...typography.label, color: colors.accent, fontVariant: ['tabular-nums'] },
  cups: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cup: { width: 68, height: 72, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', gap: 4 },
  cupDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  cupText: { ...typography.caption, color: colors.textMuted },
  cupTextDone: { color: colors.onAccent, fontWeight: '800' },
  servingNote: { ...typography.caption, color: colors.textSecondary, marginTop: 12 },
  weekCard: { marginTop: 12, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  dayWrap: { alignItems: 'center', gap: 6 },
  dayDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayCount: { ...typography.caption, color: colors.textMuted },
  dayLabel: { ...typography.caption, color: colors.textMuted },
  planCard: { marginTop: 12, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18 },
  timingHelp: { ...typography.caption, color: colors.textSecondary, marginTop: 7, marginBottom: 12 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reminder: { minHeight: 48, marginTop: 14, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  reminderText: { ...typography.label, color: colors.accent },
  message: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  science: { marginTop: 12, borderRadius: radii.card, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  scienceTitle: { ...typography.label, color: colors.textPrimary },
  scienceBody: { ...typography.caption, color: colors.textSecondary, marginTop: 5 },
  scienceSource: { ...typography.caption, color: colors.textMuted, marginTop: 8 },
  disclaimer: { ...typography.caption, color: colors.textMuted, marginVertical: spacing.section },
});
