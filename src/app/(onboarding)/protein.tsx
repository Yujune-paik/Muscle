import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PillButton, PrimaryButton, SelectionCard } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { useAppStore } from '@/state/app-store';

export default function ProteinSetupScreen() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const plan = calculateProteinPlan(profile);
  return (
    <OnboardingShell
      step={6}
      title="食事に足りない分だけ補います"
      eyebrow="PROTEIN PLAN"
      onBack={() => router.back()}
      footer={<PrimaryButton label="準備を完了する" onPress={() => router.push('/(onboarding)/ready')} testID="protein-next" />}>
      <View style={styles.planCard}>
        <View style={styles.planIcon}><MaterialCommunityIcons name="flask-outline" size={25} color={colors.onAccent} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.planLabel}>1日の行動目標</Text>
          <Text style={styles.planValue}>{plan.actionTargetGrams ? `${plan.actionTargetGrams}g` : '個別確認'}</Text>
          {plan.rangeMinGrams ? <Text style={styles.planMeta}>食事込みの目安 {plan.rangeMinGrams}〜{plan.rangeMaxGrams}g</Text> : null}
        </View>
      </View>
      <SelectionCard title="毎日、足りない分を補う" subtitle="食事量に応じて回数を提案" selected={profile.proteinMode === 'daily'} onPress={() => updateProfile({ proteinMode: 'daily' })} icon="cup-water" />
      <SelectionCard title="トレーニングした日だけ" subtitle="まず小さく始めたい人向け" selected={profile.proteinMode === 'training_days'} onPress={() => updateProfile({ proteinMode: 'training_days' })} icon="calendar-check" />
      <SelectionCard title="今は設定しない" selected={profile.proteinMode === 'off'} onPress={() => updateProfile({ proteinMode: 'off' })} icon="minus-circle-outline" />
      {profile.proteinMode !== 'off' ? (
        <View style={styles.serving}>
          <View style={styles.servingTop}>
            <View>
              <Text style={styles.servingLabel}>補助のプラン</Text>
              <Text style={styles.servingValue}>1回 {plan.servingGrams}g × {plan.scheduledServings}回</Text>
            </View>
            <Text style={styles.supplementTotal}>計 {plan.plannedSupplementGrams}g</Text>
          </View>
          <Text style={styles.servingMeta}>{plan.explanation}</Text>
          <Text style={styles.timingLabel}>記録しやすいタイミング</Text>
          <View style={styles.timing}>
            {(['post_workout', 'morning', 'evening'] as const).map((timing) => (
              <PillButton
                key={timing}
                label={{ post_workout: '運動後', morning: '朝', evening: '夜' }[timing]}
                selected={profile.proteinTiming === timing}
                onPress={() => updateProfile({ proteinTiming: timing })}
              />
            ))}
          </View>
        </View>
      ) : null}
      <View style={styles.evidence}>
        <MaterialCommunityIcons name="book-open-variant" size={18} color={colors.textSecondary} />
        <Text style={styles.note}>筋肥大では、タイミングの細かさより1日の総量が優先。1回あたり約0.3g/kgを目安に分けます。</Text>
      </View>
      <Text style={styles.disclaimer}>一般的な目安です。食事制限や持病がある場合は医師・管理栄養士に確認してください。</Text>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  planCard: { minHeight: 132, borderRadius: radii.card, padding: 18, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', flexDirection: 'row', alignItems: 'center', gap: 14 },
  planIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent },
  planLabel: { ...typography.caption, color: colors.textSecondary },
  planValue: { ...typography.displayL, color: colors.textPrimary, marginTop: 2, fontVariant: ['tabular-nums'] },
  planMeta: { ...typography.caption, color: colors.accent, marginTop: 4 },
  serving: { marginTop: spacing.related, borderRadius: radii.card, padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 8 },
  servingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  servingLabel: { ...typography.caption, color: colors.textSecondary },
  servingValue: { ...typography.heading, color: colors.textPrimary, marginTop: 3 },
  supplementTotal: { ...typography.label, color: colors.accent },
  servingMeta: { ...typography.caption, color: colors.textSecondary },
  timingLabel: { ...typography.caption, color: colors.textMuted, marginTop: 7 },
  timing: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  evidence: { flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginTop: 4 },
  note: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  disclaimer: { ...typography.caption, color: colors.textMuted },
});
