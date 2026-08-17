import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PillButton, PrimaryButton, SelectionCard } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';

export default function ProteinSetupScreen() {
  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  return (
    <OnboardingShell
      step={5}
      title="プロテインも、簡単に続けますか？"
      onBack={() => router.back()}
      footer={<PrimaryButton label="準備を完了する" onPress={() => router.push('/(onboarding)/ready')} testID="protein-next" />}>
      <SelectionCard title="1日1回" subtitle="おすすめ" selected={profile.proteinMode === 'daily'} onPress={() => updateProfile({ proteinMode: 'daily' })} icon="cup-water" />
      <SelectionCard title="トレーニングした日だけ" selected={profile.proteinMode === 'training_days'} onPress={() => updateProfile({ proteinMode: 'training_days' })} icon="calendar-check" />
      <SelectionCard title="今は設定しない" selected={profile.proteinMode === 'off'} onPress={() => updateProfile({ proteinMode: 'off' })} icon="minus-circle-outline" />
      {profile.proteinMode !== 'off' ? (
        <View style={styles.serving}>
          <View style={{ flex: 1 }}>
            <Text style={styles.servingLabel}>いつもの1杯</Text>
            <Text style={styles.servingMeta}>トレーニング後</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="タンパク質量を5グラム減らす" onPress={() => updateProfile({ proteinGrams: Math.max(10, profile.proteinGrams - 5) })} style={styles.stepper}>
            <MaterialCommunityIcons name="minus" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.grams}>{profile.proteinGrams}g</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="タンパク質量を5グラム増やす" onPress={() => updateProfile({ proteinGrams: Math.min(50, profile.proteinGrams + 5) })} style={styles.stepper}>
            <MaterialCommunityIcons name="plus" size={20} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.timing}>
            {(['post_workout', 'morning', 'evening'] as const).map((timing) => (
              <PillButton
                key={timing}
                label={{ post_workout: 'トレーニング後', morning: '朝', evening: '夜' }[timing]}
                selected={profile.proteinTiming === timing}
                onPress={() => updateProfile({ proteinTiming: timing })}
              />
            ))}
          </View>
        </View>
      ) : null}
      <Text style={styles.note}>食事全体やカロリーは記録しません。追加できた一杯だけを残します。</Text>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  serving: { marginTop: spacing.related, borderRadius: radii.card, padding: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  servingLabel: { ...typography.label, color: colors.textPrimary },
  servingMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  stepper: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised },
  grams: { ...typography.heading, color: colors.textPrimary, minWidth: 48, textAlign: 'center', fontVariant: ['tabular-nums'] },
  timing: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  note: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
});

