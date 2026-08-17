import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProteinCard } from '@/components/cards';
import { IconButton, PillButton, Screen, TopBar } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { scheduleProteinReminder } from '@/services/notifications';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function ProteinScreen() {
  const profile = useAppStore((state) => state.profile);
  const logs = useAppStore((state) => state.proteinLogs);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const logProtein = useAppStore((state) => state.logProtein);
  const [message, setMessage] = useState<string>();
  const today = logs.find((log) => log.localDate === localDateKey());
  const week = Array.from({ length: 7 }).map((_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - offset));
    const key = localDateKey(date);
    return { key, completed: logs.some((log) => log.localDate === key), day: ['日', '月', '火', '水', '木', '金', '土'][date.getDay()] };
  });
  const requestReminder = async () => {
    const result = await scheduleProteinReminder(profile.proteinTiming);
    setMessage(result.scheduled ? '次の1杯をお知らせします。' : result.reason);
  };
  return (
    <Screen>
      <TopBar left={<IconButton icon="arrow-left" label="戻る" onPress={() => router.back()} />} title="プロテイン" />
      <Text style={styles.title}>今日の1杯</Text>
      <Text style={styles.subtitle}>追加できた分だけを、軽く記録します。</Text>
      <View style={{ marginTop: spacing.section }}><ProteinCard grams={profile.proteinGrams} completed={Boolean(today)} completedAt={today?.completedAt} onLog={logProtein} /></View>
      <View style={styles.weekCard}>
        <Text style={styles.sectionLabel}>この7日間</Text>
        <View style={styles.weekRow}>
          {week.map((day) => (
            <View key={day.key} style={styles.dayWrap}>
              <View style={[styles.dayDot, day.completed && styles.dayDone]}>{day.completed ? <MaterialCommunityIcons name="check" size={15} color={colors.onAccent} /> : null}</View>
              <Text style={styles.dayLabel}>{day.day}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.planCard}>
        <Text style={styles.sectionLabel}>一杯の内容</Text>
        <View style={styles.stepperRow}>
          <Text style={styles.planName}>いつもの1杯</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="5グラム減らす" onPress={() => updateProfile({ proteinGrams: Math.max(10, profile.proteinGrams - 5) })} style={styles.step}><MaterialCommunityIcons name="minus" size={20} color={colors.textPrimary} /></Pressable>
          <Text style={styles.grams}>{profile.proteinGrams}g</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="5グラム増やす" onPress={() => updateProfile({ proteinGrams: Math.min(50, profile.proteinGrams + 5) })} style={styles.step}><MaterialCommunityIcons name="plus" size={20} color={colors.textPrimary} /></Pressable>
        </View>
        <View style={styles.pills}>
          {(['post_workout', 'morning', 'evening'] as const).map((timing) => <PillButton key={timing} label={{ post_workout: 'トレーニング後', morning: '朝', evening: '夜' }[timing]} selected={profile.proteinTiming === timing} onPress={() => updateProfile({ proteinTiming: timing })} />)}
        </View>
        <Pressable accessibilityRole="button" onPress={requestReminder} style={styles.reminder}><MaterialCommunityIcons name="bell-outline" size={19} color={colors.accent} /><Text style={styles.reminderText}>通知を設定する</Text></Pressable>
        {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
      </View>
      <Text style={styles.disclaimer}>食事を含む総タンパク質量ではなく、追加した分だけを記録しています。</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 8 },
  weekCard: { marginTop: spacing.section, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18 },
  sectionLabel: { ...typography.caption, color: colors.textSecondary },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  dayWrap: { alignItems: 'center', gap: 6 },
  dayDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  dayDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayLabel: { ...typography.caption, color: colors.textMuted },
  planCard: { marginTop: spacing.section, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18 },
  stepperRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 8 },
  planName: { ...typography.body, color: colors.textPrimary, flex: 1 },
  step: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  grams: { ...typography.heading, color: colors.textPrimary, minWidth: 50, textAlign: 'center' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reminder: { minHeight: 48, marginTop: 14, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  reminderText: { ...typography.label, color: colors.accent },
  message: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  disclaimer: { ...typography.caption, color: colors.textMuted, marginTop: spacing.section },
});

