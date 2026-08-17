import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton, Screen } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';

export default function ReadyScreen() {
  const profile = useAppStore((state) => state.profile);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)/today');
  };
  const items = [`週${profile.weeklyFrequency}回`, `1回 約${profile.sessionDuration}分`, 'マシン中心', 'Lean Athletic'];
  return (
    <Screen contentStyle={styles.content} testID="ready-screen">
      <View style={styles.mark}><MaterialCommunityIcons name="check" size={34} color={colors.onAccent} /></View>
      <Text style={styles.title}>準備できました。</Text>
      <Text style={styles.subtitle}>迷わないための最初のルートを作りました。</Text>
      <View style={styles.summary}>
        {items.map((item, index) => (
          <View key={item} style={[styles.summaryRow, index === items.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.summaryDot} />
            <Text style={styles.summaryText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.safety}>
        <MaterialCommunityIcons name="shield-check-outline" size={20} color={colors.textSecondary} />
        <Text style={styles.safetyText}>一般的なフィットネス案内です。痛みや体調不良があるときは中止し、必要に応じて専門家へ相談してください。</Text>
      </View>
      <View style={styles.footer}><PrimaryButton label="今日を見る" icon="arrow-right" onPress={finish} testID="ready-finish" /></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { minHeight: 790, paddingTop: 78 },
  mark: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: spacing.section },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 10 },
  summary: { marginTop: spacing.major, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 18 },
  summaryRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  summaryText: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  safety: { marginTop: 20, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  safetyText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  footer: { marginTop: 'auto', paddingTop: spacing.major },
});

