import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BodyMap } from '@/components/media/exercise-motion';
import { OnboardingShell } from '@/components/onboarding/onboarding-shell';
import { PrimaryButton } from '@/components/primitives';
import { colors, radii, typography } from '@/design/tokens';

export default function BodyGoalScreen() {
  return (
    <OnboardingShell
      step={1}
      title="どんな方向を目指しますか？"
      onBack={() => router.back()}
      footer={<PrimaryButton label="これで進む" onPress={() => router.push('/(onboarding)/experience')} testID="goal-next" />}>
      <View accessibilityRole="radio" accessibilityState={{ selected: true }} style={styles.card}>
        <View style={styles.visual}>
          <BodyMap muscles={['chest', 'back', 'shoulders']} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>SELECTED GOAL</Text>
          <Text style={styles.title}>Lean Athletic</Text>
          <Text style={styles.subtitle}>肩・胸・背中を育てた、引き締まった全身体型</Text>
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.media, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.accent, overflow: 'hidden' },
  visual: { height: 270, backgroundColor: '#111113', overflow: 'hidden' },
  copy: { padding: 20 },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.4 },
  title: { ...typography.title, color: colors.textPrimary, marginTop: 7 },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 7 },
});

