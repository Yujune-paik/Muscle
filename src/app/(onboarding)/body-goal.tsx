import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PillButton, PrimaryButton, SelectionCard } from '@/components/primitives';
import { colors, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';
import type { FocusMuscleId, PhysiqueGoalId } from '@/types';

const goals: { value: PhysiqueGoalId; title: string; subtitle: string; icon: 'run' | 'triangle-outline' | 'dumbbell' | 'weight-lifter' }[] = [
  { value: 'lean_athletic', title: 'Lean Athletic', subtitle: '引き締まった、動ける全身体型', icon: 'run' },
  { value: 'v_taper', title: 'V-Taper', subtitle: '背中と肩を広げ、逆三角形へ', icon: 'triangle-outline' },
  { value: 'balanced_muscle', title: 'Balanced Muscle', subtitle: '全身をバランスよく大きく', icon: 'dumbbell' },
  { value: 'lower_body_athletic', title: 'Lower Body Athletic', subtitle: '脚・お尻を軸に力強い身体へ', icon: 'weight-lifter' },
];

const focus: { value: FocusMuscleId; label: string }[] = [
  { value: 'chest', label: '胸' },
  { value: 'back', label: '背中' },
  { value: 'shoulders', label: '肩' },
  { value: 'arms', label: '腕' },
  { value: 'legs', label: '脚・お尻' },
];

export default function BodyGoalScreen() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  return (
    <OnboardingShell
      step={1}
      title="どんな身体を目指しますか？"
      eyebrow="GOAL & FOCUS"
      onBack={() => router.back()}
      footer={<PrimaryButton label="この方向で進む" onPress={() => router.push('/(onboarding)/science-profile' as Href)} testID="goal-next" />}>
      {goals.map((goal) => (
        <SelectionCard
          key={goal.value}
          title={goal.title}
          subtitle={goal.subtitle}
          icon={goal.icon}
          selected={profile.goal === goal.value}
          onPress={() => updateProfile({ goal: goal.value })}
        />
      ))}
      <View style={styles.focusSection}>
        <Text style={styles.focusTitle}>とくに伸ばしたい部位</Text>
        <Text style={styles.focusMeta}>ここだけに偏らず、週のセット数を少し増やします。</Text>
        <View style={styles.focusRow}>
          {focus.map((item) => (
            <PillButton
              key={item.value}
              label={item.label}
              selected={profile.focusMuscle === item.value}
              onPress={() => updateProfile({ focusMuscle: item.value })}
            />
          ))}
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  focusSection: { marginTop: spacing.related, gap: 8 },
  focusTitle: { ...typography.heading, color: colors.textPrimary },
  focusMeta: { ...typography.caption, color: colors.textSecondary },
  focusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
});
