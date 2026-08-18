import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PrimaryButton, SelectionCard } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { useAppStore } from '@/state/app-store';
import type { ProteinMealCoverage } from '@/types';

const coverageOptions: { value: ProteinMealCoverage; title: string; subtitle: string }[] = [
  { value: 'low', title: '少ない', subtitle: '肉・魚・卵・大豆・乳製品が1日0〜1食' },
  { value: 'medium', title: 'ふつう', subtitle: 'たんぱく質のある食事が1日2食' },
  { value: 'high', title: '多い', subtitle: 'たんぱく質のある食事が1日3食以上' },
  { value: 'unknown', title: 'わからない', subtitle: 'まずは控えめな補助から始める' },
];

export default function ScienceProfileScreen() {
  const profile = useAppStore((state) => state.profile);
  const onboardingCompleted = useAppStore((state) => state.onboardingCompleted);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const completeScienceProfile = useAppStore((state) => state.completeScienceProfile);
  const [weight, setWeight] = useState(profile.bodyWeightKg ? String(profile.bodyWeightKg) : '');
  const [height, setHeight] = useState(profile.heightCm ? String(profile.heightCm) : '');
  const parsedWeight = Number(weight.replace(',', '.'));
  const parsedHeight = height ? Number(height.replace(',', '.')) : null;
  const valid = parsedWeight >= 35 && parsedWeight <= 250 && (!parsedHeight || (parsedHeight >= 120 && parsedHeight <= 230));
  const preview = useMemo(
    () => calculateProteinPlan({ ...profile, bodyWeightKg: valid ? parsedWeight : null }),
    [parsedWeight, profile, valid],
  );

  const next = () => {
    if (!valid) return;
    updateProfile({ bodyWeightKg: parsedWeight, heightCm: parsedHeight });
    if (onboardingCompleted) {
      completeScienceProfile();
      router.replace('/(tabs)/today');
    } else {
      router.push('/(onboarding)/experience');
    }
  };

  return (
    <OnboardingShell
      step={2}
      title="体格と普段の食事を教えてください"
      eyebrow="PERSONAL BASELINE"
      onBack={() => router.back()}
      footer={<PrimaryButton label={onboardingCompleted ? '提案を更新する' : '次へ'} disabled={!valid} onPress={next} testID="science-next" />}>
      <View style={styles.metrics}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>体重（必須）</Text>
          <View style={styles.inputShell}>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              inputMode="decimal"
              placeholder="例 65"
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="体重"
              testID="science-weight"
              style={styles.input}
            />
            <Text style={styles.unit}>kg</Text>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>身長（任意）</Text>
          <View style={styles.inputShell}>
            <TextInput
              value={height}
              onChangeText={setHeight}
              keyboardType="decimal-pad"
              inputMode="decimal"
              placeholder="例 170"
              placeholderTextColor={colors.textMuted}
              accessibilityLabel="身長"
              testID="science-height"
              style={styles.input}
            />
            <Text style={styles.unit}>cm</Text>
          </View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>普段の食事からとれている量</Text>
      {coverageOptions.map((option) => (
        <SelectionCard
          key={option.value}
          title={option.title}
          subtitle={option.subtitle}
          selected={profile.proteinMealCoverage === option.value}
          onPress={() => updateProfile({ proteinMealCoverage: option.value })}
        />
      ))}
      <Text style={styles.sectionTitle}>安全の確認</Text>
      <SelectionCard
        title="特別な制限はない"
        subtitle="一般的な健康情報として提案する"
        selected={profile.nutritionSafetyStatus === 'standard'}
        onPress={() => updateProfile({ nutritionSafetyStatus: 'standard' })}
        icon="shield-check-outline"
      />
      <SelectionCard
        title="腎疾患・妊娠・食事制限などがある"
        subtitle="量を自動提案せず、医師・管理栄養士への確認を優先"
        selected={profile.nutritionSafetyStatus === 'consult'}
        onPress={() => updateProfile({ nutritionSafetyStatus: 'consult' })}
        icon="doctor"
      />
      {valid && profile.nutritionSafetyStatus === 'standard' ? (
        <View style={styles.preview}>
          <MaterialCommunityIcons name="flask-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.previewTitle}>1日の行動目標 {preview.actionTargetGrams}g</Text>
            <Text style={styles.previewMeta}>食事込みの目安 {preview.rangeMinGrams}〜{preview.rangeMaxGrams}g。サプリだけの量ではありません。</Text>
          </View>
        </View>
      ) : null}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', gap: 10 },
  inputGroup: { flex: 1, gap: 7 },
  inputLabel: { ...typography.caption, color: colors.textSecondary },
  inputShell: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderRadius: radii.compact, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 14 },
  input: { flex: 1, ...typography.heading, color: colors.textPrimary },
  unit: { ...typography.label, color: colors.textSecondary },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginTop: spacing.related },
  preview: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 16, borderRadius: radii.card, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27' },
  previewTitle: { ...typography.label, color: colors.textPrimary },
  previewMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
