import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BodyMap } from '@/components/media/exercise-motion';
import { PrimaryButton, Screen } from '@/components/primitives';
import { colors, spacing, typography } from '@/design/tokens';

export default function WelcomeScreen() {
  return (
    <Screen contentStyle={styles.content} testID="welcome-screen">
      <View style={styles.wordmarkRow}>
        <Text style={styles.wordmark}>NXTSET</Text>
        <View style={styles.demoPill}><Text style={styles.demoText}>DEMO</Text></View>
      </View>
      <View style={styles.hero}>
        <View style={styles.aura} />
        <BodyMap muscles={['chest', 'back', 'shoulders']} />
        <View style={styles.heroLabel}>
          <View style={styles.heroDot} />
          <Text style={styles.heroLabelText}>NEXT: CHEST PRESS</Text>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>次の一台だけ、{`\n`}見ればいい。</Text>
        <Text style={styles.subtitle}>ジムの器具に合わせて、今日やることを一つずつ案内します。</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="はじめる" icon="arrow-right" onPress={() => router.push('/(onboarding)/body-goal')} testID="welcome-start" />
        <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/today')} style={styles.signIn}>
          <Text style={styles.signInText}>すでに使っている方</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { minHeight: 790 },
  wordmarkRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { ...typography.label, color: colors.textPrimary, letterSpacing: 3.4 },
  demoPill: { borderRadius: 999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 9, paddingVertical: 5 },
  demoText: { ...typography.caption, color: colors.textMuted, letterSpacing: 1 },
  hero: { height: 330, marginHorizontal: -20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  aura: { position: 'absolute', width: 330, height: 330, borderRadius: 165, backgroundColor: 'rgba(215,255,74,0.05)' },
  heroLabel: { position: 'absolute', bottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8 },
  heroDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  heroLabelText: { ...typography.caption, color: colors.textSecondary, letterSpacing: 1 },
  copy: { marginTop: spacing.related },
  title: { ...typography.displayXL, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 16, maxWidth: 340 },
  footer: { marginTop: 'auto', gap: 8, paddingTop: spacing.major },
  signIn: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  signInText: { ...typography.label, color: colors.textSecondary },
});

