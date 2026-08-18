import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PrimaryButton, SelectionCard } from '@/components/primitives';
import { colors, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';

export default function GymScreen() {
  const gymName = useAppStore((state) => state.profile.gymName);
  const updateProfile = useAppStore((state) => state.updateProfile);
  return (
    <OnboardingShell
      step={5}
      title="どこでトレーニングしますか？"
      onBack={() => router.back()}
      footer={<PrimaryButton label="次へ" onPress={() => router.push('/(onboarding)/protein')} testID="gym-next" />}>
      <SelectionCard
        title="Demo Gym"
        subtitle="基本マシンあり · すぐ試せます"
        selected={gymName === 'Demo Gym'}
        onPress={() => updateProfile({ gymName: 'Demo Gym' })}
        icon="map-marker"
      />
      <SelectionCard
        title="自分のジムをあとで設定"
        subtitle="店舗を登録せずに始める"
        selected={gymName === '未設定のジム'}
        onPress={() => updateProfile({ gymName: '未設定のジム' })}
        icon="dumbbell"
      />
      <Text style={styles.note}>器具は使いながら覚えていくので、最初に全部登録する必要はありません。</Text>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({ note: { ...typography.caption, color: colors.textMuted, marginTop: 6 } });
