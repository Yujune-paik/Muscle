import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { isCloudMode } from '@/services/supabase';
import { useAppStore } from '@/state/app-store';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function SettingsRow({ icon, label, value, onPress }: { icon: IconName; label: string; value?: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}${value ? `、${value}` : ''}`} onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.textSecondary} />
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <MaterialCommunityIcons name="chevron-right" size={21} color={colors.textMuted} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const profile = useAppStore((state) => state.profile);
  const completedCount = useAppStore((state) => state.completedSessions.length);
  const proteinPlan = calculateProteinPlan(profile);
  const goalLabel = {
    lean_athletic: 'Lean Athletic',
    v_taper: 'V-Taper',
    balanced_muscle: 'Balanced Muscle',
    lower_body_athletic: 'Lower Body Athletic',
  }[profile.goal];
  return (
    <Screen testID="profile-screen">
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOU</Text>
        <Text style={styles.title}>あなた</Text>
        <Text style={styles.mode}>{isCloudMode ? 'クラウド同期' : 'この端末に保存'} · Demo</Text>
      </View>
      {completedCount > 0 && !isCloudMode ? (
        <Pressable accessibilityRole="button" onPress={() => router.push('/account/link')} style={styles.protectCard}>
          <View style={styles.protectIcon}><MaterialCommunityIcons name="shield-lock-outline" size={24} color={colors.onAccent} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.protectTitle}>データを守る</Text>
            <Text style={styles.protectText}>メールへ連携すると、端末を変えても復元できます。</Text>
          </View>
          <MaterialCommunityIcons name="arrow-right" size={21} color={colors.accent} />
        </Pressable>
      ) : null}
      <Text style={styles.sectionLabel}>プラン</Text>
      <View style={styles.list}>
        <SettingsRow icon="target" label="現在の目標" value={goalLabel} onPress={() => router.push('/(onboarding)/body-goal')} />
        <SettingsRow icon="human-male-height" label="体格と食事" value={profile.bodyWeightKg ? `${profile.bodyWeightKg}kg` : '未設定'} onPress={() => router.push('/(onboarding)/science-profile' as Href)} />
        <SettingsRow icon="calendar-blank-outline" label="頻度と時間" value={`週${profile.weeklyFrequency} · ${profile.sessionDuration}分`} onPress={() => router.push('/(onboarding)/schedule')} />
        <SettingsRow icon="map-marker-outline" label="ジム" value={profile.gymName} onPress={() => router.push('/gym')} />
        <SettingsRow icon="cup-water" label="プロテイン" value={profile.proteinMode === 'off' ? '設定なし' : `目標 ${proteinPlan.actionTargetGrams ?? '—'}g`} onPress={() => router.push('/protein')} />
      </View>
      <Text style={styles.sectionLabel}>設定とサポート</Text>
      <View style={styles.list}>
        <SettingsRow icon="account-lock-outline" label="アカウント" value={isCloudMode ? '連携可能' : 'デモ'} onPress={() => router.push('/account/link')} />
        <SettingsRow icon="tune-variant" label="単位・通知・表示" onPress={() => router.push('/settings')} />
        <SettingsRow icon="shield-check-outline" label="プライバシーとデータ" onPress={() => router.push('/account/privacy')} />
        <SettingsRow icon="lifebuoy" label="ヘルプと安全上の注意" onPress={() => router.push('/help')} />
      </View>
      <Text style={styles.version}>NXTSET MVP · v0.1</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 28, paddingBottom: spacing.section },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.6 },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: 8 },
  mode: { ...typography.caption, color: colors.textSecondary, marginTop: 7 },
  protectCard: { minHeight: 104, borderRadius: radii.card, borderWidth: 1, borderColor: '#3C4726', backgroundColor: '#20231A', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  protectIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accent },
  protectTitle: { ...typography.label, color: colors.textPrimary },
  protectText: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  sectionLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.major, marginBottom: 8, letterSpacing: 1.1 },
  list: { borderTopWidth: 1, borderTopColor: colors.border },
  row: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { ...typography.body, color: colors.textPrimary, flex: 1 },
  rowValue: { ...typography.caption, color: colors.textSecondary, maxWidth: 120 },
  version: { ...typography.caption, color: colors.textMuted, marginTop: 32, textAlign: 'center' },
});
