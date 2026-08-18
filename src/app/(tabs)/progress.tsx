import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { MuscleHeatmap } from '@/components/progress/muscle-heatmap';
import { Screen } from '@/components/primitives';
import { colors, radii, spacing, typography } from '@/design/tokens';
import { calculateMomentum } from '@/domain/momentum';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { calculateMuscleStimulus } from '@/domain/stimulus';
import { useAppStore } from '@/state/app-store';
import { localDateKey } from '@/utils/units';

export default function ProgressScreen() {
  const profile = useAppStore((state) => state.profile);
  const sessions = useAppStore((state) => state.completedSessions);
  const proteinLogs = useAppStore((state) => state.proteinLogs);
  const xpEvents = useAppStore((state) => state.xpEvents);
  const next = useAppStore((state) => state.nextPrescriptions);
  const momentum = calculateMomentum(xpEvents, sessions, profile.weeklyFrequency);
  const latest = sessions[0];
  const stimulus = calculateMuscleStimulus(latest, sessions.slice(1), profile);
  const proteinPlan = calculateProteinPlan(profile);
  const todayProtein = proteinLogs.filter((log) => log.localDate === localDateKey()).length;
  const topNext = Object.values(next)[0];

  return (
    <Screen testID="progress-screen">
      <View style={styles.header}>
        <Text style={styles.eyebrow}>MOMENTUM</Text>
        <Text style={styles.title}>積み上げ</Text>
      </View>

      <View style={styles.levelCard}>
        <View style={styles.levelOrb}><Text style={styles.levelSmall}>LEVEL</Text><Text style={styles.levelValue}>{momentum.level}</Text></View>
        <View style={{ flex: 1 }}>
          <View style={styles.levelTop}><Text style={styles.totalXp}>{momentum.totalXp} XP</Text><Text style={styles.levelRemaining}>あと {momentum.nextLevelXp - momentum.levelXp}</Text></View>
          <View style={styles.xpTrack}><View style={[styles.xpFill, { width: `${(momentum.levelXp / momentum.nextLevelXp) * 100}%` }]} /></View>
          <Text style={styles.levelMeta}>トレーニング・回復確認・補助プランの達成がXPになります。</Text>
        </View>
      </View>

      <View style={styles.chainCard}>
        <View style={styles.chainIcon}><MaterialCommunityIcons name="fire" size={28} color={colors.onAccent} /></View>
        <View style={{ flex: 1 }}><Text style={styles.chainValue}>{momentum.chainWeeks}週チェーン</Text><Text style={styles.chainMeta}>今週 {momentum.thisWeekWorkouts}/{profile.weeklyFrequency}回 · 毎日ではなく週の継続を評価</Text></View>
        {momentum.recoveryWeeks > 0 ? <View style={styles.recoveryBadge}><MaterialCommunityIcons name="shield-check" size={16} color={colors.accent} /><Text style={styles.recoveryText}>{momentum.recoveryWeeks}</Text></View> : null}
      </View>

      <Text style={styles.sectionTitle}>成長パス</Text>
      <View style={styles.pathCard}>
        {Array.from({ length: Math.max(5, Math.min(8, sessions.length + 2)) }).map((_, index) => {
          const complete = index < sessions.length;
          const current = index === sessions.length;
          const xp = xpEvents.find((event) => event.sourceId === `workout-${sessions[index]?.id}`)?.xp;
          return (
            <View key={index} style={[styles.pathStep, index % 2 === 1 && styles.pathStepRight]}>
              {index > 0 ? <View style={[styles.pathLine, index % 2 === 1 && styles.pathLineRight]} /> : null}
              <View style={[styles.pathNode, complete && styles.pathNodeDone, current && styles.pathNodeCurrent]}>
                <MaterialCommunityIcons name={complete ? 'check-bold' : current ? 'play' : 'lock-outline'} size={23} color={complete ? colors.onAccent : current ? colors.onAccent : colors.textMuted} />
              </View>
              <View style={[styles.pathCopy, index % 2 === 1 && { alignItems: 'flex-end' }]}>
                <Text style={[styles.pathTitle, !complete && !current && styles.pathLocked]}>{complete ? sessions[index]?.title : current ? '次のセッション' : 'この先で解放'}</Text>
                <Text style={styles.pathMeta}>{complete ? `+${xp ?? 0} XP` : current ? '今日から進める' : 'まず手前のノードへ'}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}><View><Text style={styles.sectionTitle}>前回の筋刺激</Text><Text style={styles.sectionMeta}>セット数・努力度・体格・過去の負荷から推定</Text></View>{latest ? <Text style={styles.latestDate}>{new Date(latest.completedAt ?? latest.startedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</Text> : null}</View>
      <View style={styles.heatCard}>
        {latest ? <MuscleHeatmap stimulus={stimulus} /> : <View style={styles.emptyHeat}><MaterialCommunityIcons name="human-handsup" size={44} color={colors.textMuted} /><Text style={styles.emptyText}>最初のトレーニング後に、部位別の刺激が5段階で表示されます。</Text></View>}
        <Text style={styles.heatNote}>赤さは筋肉の「損傷」ではなく、その日の相対的なトレーニング刺激です。痛みの評価には使いません。</Text>
      </View>

      <View style={styles.metricRow}>
        <View style={styles.metricCard}><Text style={styles.metricValue}>{Object.keys(next).length}</Text><Text style={styles.metricLabel}>種目で次回調整</Text></View>
        <View style={styles.metricCard}><Text style={styles.metricValue}>{todayProtein}<Text style={styles.metricSmall}> / {proteinPlan.scheduledServings}</Text></Text><Text style={styles.metricLabel}>今日の補助</Text></View>
      </View>
      <View style={styles.nextCard}><Text style={styles.nextLabel}>NEXT ADJUSTMENT</Text><Text style={styles.nextText}>{topNext?.reason ?? '最初の記録から、次回の重さと回数を1段階ずつ調整します。'}</Text></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 28, paddingBottom: spacing.section },
  eyebrow: { ...typography.caption, color: colors.accent, letterSpacing: 1.6 },
  title: { ...typography.displayL, color: colors.textPrimary, marginTop: 8 },
  levelCard: { minHeight: 132, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 15 },
  levelOrb: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  levelSmall: { ...typography.caption, color: colors.onAccent, fontWeight: '800' },
  levelValue: { ...typography.title, color: colors.onAccent, lineHeight: 26 },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between' },
  totalXp: { ...typography.heading, color: colors.textPrimary },
  levelRemaining: { ...typography.caption, color: colors.textSecondary },
  xpTrack: { height: 9, marginTop: 9, borderRadius: 5, backgroundColor: colors.surfaceRaised, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 5 },
  levelMeta: { ...typography.caption, color: colors.textMuted, marginTop: 7 },
  chainCard: { minHeight: 88, marginTop: 10, borderRadius: radii.card, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  chainIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  chainValue: { ...typography.heading, color: colors.textPrimary },
  chainMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  recoveryBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recoveryText: { ...typography.label, color: colors.accent },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginTop: spacing.major },
  sectionMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  pathCard: { marginTop: 12, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18, overflow: 'hidden' },
  pathStep: { minHeight: 92, width: '70%', flexDirection: 'row', alignItems: 'center', gap: 12, position: 'relative' },
  pathStepRight: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  pathLine: { position: 'absolute', width: 3, height: 54, backgroundColor: colors.border, left: 27, top: -28 },
  pathLineRight: { left: undefined, right: 27 },
  pathNode: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.surfaceRaised, borderWidth: 3, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  pathNodeDone: { backgroundColor: colors.accent, borderColor: '#E5FF86' },
  pathNodeCurrent: { backgroundColor: colors.accent, borderColor: colors.white, shadowColor: colors.accent, shadowOpacity: 0.35, shadowRadius: 12 },
  pathCopy: { flex: 1 },
  pathTitle: { ...typography.label, color: colors.textPrimary },
  pathLocked: { color: colors.textMuted },
  pathMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  latestDate: { ...typography.caption, color: colors.textMuted, marginBottom: 2 },
  heatCard: { marginTop: 12, borderRadius: radii.card, backgroundColor: '#111113', borderWidth: 1, borderColor: colors.border, padding: 14, overflow: 'hidden' },
  emptyHeat: { minHeight: 240, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 12 },
  heatNote: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: 5 },
  metricRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  metricCard: { flex: 1, minHeight: 112, borderRadius: radii.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 18, justifyContent: 'center' },
  metricValue: { ...typography.displayL, color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  metricSmall: { ...typography.body, color: colors.textSecondary },
  metricLabel: { ...typography.caption, color: colors.textSecondary, marginTop: 7 },
  nextCard: { marginTop: 12, minHeight: 126, borderRadius: radii.card, backgroundColor: '#20231A', borderWidth: 1, borderColor: '#343A27', padding: 20, justifyContent: 'center', marginBottom: 8 },
  nextLabel: { ...typography.caption, color: colors.accent, letterSpacing: 1.2 },
  nextText: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginTop: 9 },
});
