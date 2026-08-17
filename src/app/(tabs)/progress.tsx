import { StyleSheet, Text, View } from 'react-native';

import { WeeklySummaryCard } from '@/components/cards';
import { BodyMap } from '@/components/media/exercise-motion';
import { Screen } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function ProgressScreen() {
  const profile = useAppStore((state) => state.profile);
  const sessions = useAppStore((state) => state.completedSessions);
  const proteinLogs = useAppStore((state) => state.proteinLogs);
  const next = useAppStore((state) => state.nextPrescriptions);
  const completed = Math.min(profile.weeklyFrequency, sessions.length);
  const advanced = Object.values(next);
  const recentProtein = proteinLogs.filter((log) => {
    const diff = new Date(localDateKey()).getTime() - new Date(log.localDate).getTime();
    return diff >= 0 && diff < 7 * 86_400_000;
  }).length;
  const topNext = Object.values(next)[0];

  return (
    <Screen testID="progress-screen">
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PROGRESS</Text>
        <Text style={styles.title}>今週の進み</Text>
      </View>
      {sessions.length === 0 ? <Text style={styles.empty}>2回のトレーニング後から、変化をまとめます。</Text> : null}
      <WeeklySummaryCard completed={completed} target={profile.weeklyFrequency} />
      <View style={styles.bodyCard}>
        <View style={styles.bodyCopy}>
          <Text style={styles.cardLabel}>鍛えた部位</Text>
          <Text style={styles.cardTitle}>胸・背中・脚・肩</Text>
          <Text style={styles.cardMeta}>色だけでなく、部位名でも確認できます。</Text>
        </View>
        <View style={styles.bodyVisual}><BodyMap muscles={['chest', 'back', 'legs', 'shoulders']} /></View>
      </View>
      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{advanced.length}</Text>
          <Text style={styles.metricLabel}>種目で前進</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{recentProtein}<Text style={styles.metricSmall}> / 7日</Text></Text>
          <Text style={styles.metricLabel}>プロテイン</Text>
        </View>
      </View>
      <View style={styles.nextCard}>
        <Text style={styles.nextLabel}>NEXT ADJUSTMENT</Text>
        <Text style={styles.nextText}>{topNext?.reason ?? '最初の記録から、次回の負荷を一つだけ調整します。'}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 28, paddingBottom: spacing.section },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.6 },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: 8 },
  empty: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.section },
  bodyCard: { height: 250, marginTop: spacing.related, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', flexDirection: 'row' },
  bodyCopy: { width: '52%', padding: 20, zIndex: 1, justifyContent: 'center' },
  bodyVisual: { width: '48%', transform: [{ scale: 0.76 }] },
  cardLabel: { ...typography.caption, color: colors.textSecondary },
  cardTitle: { ...typography.heading, color: colors.textPrimary, marginTop: 8 },
  cardMeta: { ...typography.caption, color: colors.textMuted, marginTop: 10 },
  metricRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  metricCard: { flex: 1, minHeight: 126, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18, justifyContent: 'center' },
  metricValue: { ...typography.displayL, color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  metricSmall: { ...typography.body, color: colors.textSecondary },
  metricLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 7 },
  nextCard: { marginTop: 12, minHeight: 126, borderRadius: radii.card, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', padding: 20, justifyContent: 'center' },
  nextLabel: { ...typography.caption, color: colors.accent, letterSpacing: 1.2 },
  nextText: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginTop: 9 },
});

