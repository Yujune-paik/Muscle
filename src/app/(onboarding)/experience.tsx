import { router } from 'expo-router';
import { useState } from 'react';

import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PrimaryButton, SelectionCard } from '@/components/primitives';
import { useAppStore } from '@/state/app-store';
import type { ExperienceLevel } from '@/types';

const options: { value: ExperienceLevel; title: string; subtitle?: string }[] = [
  { value: 'first', title: 'ほぼ初めて' },
  { value: 'some', title: '何度か試した' },
  { value: 'regular', title: '3か月以上続けたことがある', subtitle: '初心者向けの案内から始まります' },
];

export default function ExperienceScreen() {
  const initial = useAppStore((state) => state.profile.experience);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [selected, setSelected] = useState<ExperienceLevel>(initial);
  const next = () => {
    updateProfile({ experience: selected });
    router.push('/(onboarding)/schedule');
  };
  return (
    <OnboardingShell step={2} title="ジムの筋トレ経験は？" onBack={() => router.back()} footer={<PrimaryButton label="次へ" onPress={next} testID="experience-next" />}>
      {options.map((option) => (
        <SelectionCard key={option.value} title={option.title} subtitle={option.subtitle} selected={selected === option.value} onPress={() => setSelected(option.value)} />
      ))}
    </OnboardingShell>
  );
}

