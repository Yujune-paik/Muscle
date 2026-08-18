import type { UserProfile } from '@/types';

export type ProteinPlan = {
  personalized: boolean;
  actionTargetGrams: number | null;
  rangeMinGrams: number | null;
  rangeMaxGrams: number | null;
  servingGrams: number;
  scheduledServings: number;
  plannedSupplementGrams: number;
  explanation: string;
};

const roundToFive = (value: number) => Math.round(value / 5) * 5;

export function calculateProteinPlan(profile: UserProfile): ProteinPlan {
  const weight = profile.bodyWeightKg;
  if (!weight || profile.nutritionSafetyStatus === 'consult') {
    return {
      personalized: false,
      actionTargetGrams: null,
      rangeMinGrams: null,
      rangeMaxGrams: null,
      servingGrams: profile.proteinGrams || 25,
      scheduledServings: profile.proteinMode === 'off' ? 0 : 1,
      plannedSupplementGrams: profile.proteinMode === 'off' ? 0 : profile.proteinGrams || 25,
      explanation:
        profile.nutritionSafetyStatus === 'consult'
          ? '食事制限や健康状態に合わせるため、医師・管理栄養士へ確認してください。'
          : '体重を設定すると、食事を含む1日の目安を計算できます。',
    };
  }

  const servingGrams = Math.min(40, Math.max(20, roundToFive(weight * 0.3)));
  const suggestedServings = {
    low: 2,
    medium: 1,
    high: 0,
    unknown: 1,
  }[profile.proteinMealCoverage];
  const scheduledServings = profile.proteinMode === 'off' ? 0 : suggestedServings;

  return {
    personalized: true,
    actionTargetGrams: roundToFive(weight * 1.6),
    rangeMinGrams: roundToFive(weight * 1.4),
    rangeMaxGrams: roundToFive(weight * 2),
    servingGrams,
    scheduledServings,
    plannedSupplementGrams: servingGrams * scheduledServings,
    explanation:
      scheduledServings === 0
        ? '普段の食事を中心に、足りない食事がある日だけ補助を使います。'
        : `${scheduledServings}回に分け、残りは普段の食事からとる計画です。`,
  };
}
