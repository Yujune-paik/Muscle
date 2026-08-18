import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PillButton, PrimaryButton } from '@/components/primitives';
import { colors, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';

export default function ScheduleScreen() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  return (
    <OnboardingShell
      step={4}
      title="週に何回なら、無理なく行けそう？"
      onBack={() => router.back()}
      footer={<PrimaryButton label="次へ" onPress={() => router.push('/(onboarding)/gym')} testID="schedule-next" />}>
      <Text style={styles.label}>頻度</Text>
      <View style={styles.row}>
        <PillButton label="週2回" selected={profile.weeklyFrequency === 2} onPress={() => updateProfile({ weeklyFrequency: 2 })} />
        <PillButton label="週3回 · 推奨" selected={profile.weeklyFrequency === 3} onPress={() => updateProfile({ weeklyFrequency: 3 })} />
      </View>
      <Text style={[styles.label, { marginTop: spacing.section }]}>1回の時間</Text>
      <View style={styles.row}>
        {([30, 45, 60] as const).map((duration) => (
          <PillButton key={duration} label={`${duration}分${duration === 45 ? ' · 推奨' : ''}`} selected={profile.sessionDuration === duration} onPress={() => updateProfile({ sessionDuration: duration })} />
        ))}
      </View>
      <Text style={styles.note}>時間に合わせて補助種目だけを調整します。全身の基本は変わりません。</Text>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, color: colors.textSecondary },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: { ...typography.caption, color: colors.textMuted, marginTop: 12 },
});
