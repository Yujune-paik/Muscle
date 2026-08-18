import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Ellipse, G, Path, Rect } from 'react-native-svg';

import { colors, typography } from '@/design/tokens';
import { muscleIds, muscleLabels, type MuscleStimulus } from '@/domain/stimulus';
import type { MuscleId } from '@/types';

const bandColor: Record<MuscleStimulus['band'], string> = {
  rest: '#3C3D42',
  light: '#763F43',
  moderate: '#A8484D',
  solid: '#DD5056',
  very_high: '#FF5A5F',
};

const emptyStimulus: MuscleStimulus = { score: 0, band: 'rest', pain: false };

function MuscleShape({ id, stimulus, children }: { id: MuscleId; stimulus: MuscleStimulus; children: ReactNode }) {
  return (
    <G accessibilityLabel={`${muscleLabels[id]} 刺激${stimulus.score}%${stimulus.pain ? '、痛みの記録あり' : ''}`}>
      {children}
    </G>
  );
}

export function MuscleHeatmap({ stimulus, compact = false }: { stimulus: Record<MuscleId, MuscleStimulus>; compact?: boolean }) {
  const fill = (id: MuscleId) => bandColor[(stimulus[id] ?? emptyStimulus).band];
  const stroke = (id: MuscleId) => (stimulus[id]?.pain ? colors.warning : '#18181B');
  return (
    <View accessible accessibilityRole="image" accessibilityLabel="前面と背面の筋肉刺激ヒートマップ" style={[styles.root, compact && styles.compact]}>
      <View style={styles.figures}><View style={styles.figure}>
        <Text style={styles.figureLabel}>FRONT</Text>
        <Svg width="150" height="270" viewBox="0 0 150 270">
          <Ellipse cx="75" cy="24" rx="18" ry="21" fill="#505158" />
          <Path d="M59 47 Q75 42 91 47 L101 77 L95 137 L55 137 L49 77 Z" fill="#414247" />
          <MuscleShape id="shoulders" stimulus={stimulus.shoulders}><Ellipse cx="51" cy="68" rx="13" ry="15" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth="2" /><Ellipse cx="99" cy="68" rx="13" ry="15" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="chest" stimulus={stimulus.chest}><Path d="M58 59 Q74 51 74 82 Q62 87 54 78 Z" fill={fill('chest')} stroke={stroke('chest')} strokeWidth="2" /><Path d="M92 59 Q76 51 76 82 Q88 87 96 78 Z" fill={fill('chest')} stroke={stroke('chest')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="core" stimulus={stimulus.core}><Rect x="62" y="87" width="26" height="46" rx="10" fill={fill('core')} stroke={stroke('core')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="biceps" stimulus={stimulus.biceps}><Path d="M42 75 Q31 94 32 120 L45 123 Q51 98 55 80 Z" fill={fill('biceps')} stroke={stroke('biceps')} strokeWidth="2" /><Path d="M108 75 Q119 94 118 120 L105 123 Q99 98 95 80 Z" fill={fill('biceps')} stroke={stroke('biceps')} strokeWidth="2" /></MuscleShape>
          <Path d="M32 121 L30 160 Q35 168 42 160 L45 123 Z" fill="#4A4B50" /><Path d="M118 121 L120 160 Q115 168 108 160 L105 123 Z" fill="#4A4B50" />
          <MuscleShape id="quadriceps" stimulus={stimulus.quadriceps}><Path d="M55 139 Q52 173 55 215 L72 215 L73 141 Z" fill={fill('quadriceps')} stroke={stroke('quadriceps')} strokeWidth="2" /><Path d="M95 139 Q98 173 95 215 L78 215 L77 141 Z" fill={fill('quadriceps')} stroke={stroke('quadriceps')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="calves" stimulus={stimulus.calves}><Path d="M55 217 L58 258 L70 258 L72 217 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth="2" /><Path d="M95 217 L92 258 L80 258 L78 217 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth="2" /></MuscleShape>
        </Svg>
      </View>
      <View style={styles.figure}>
        <Text style={styles.figureLabel}>BACK</Text>
        <Svg width="150" height="270" viewBox="0 0 150 270">
          <Ellipse cx="75" cy="24" rx="18" ry="21" fill="#505158" />
          <Path d="M59 47 Q75 42 91 47 L101 77 L95 137 L55 137 L49 77 Z" fill="#414247" />
          <MuscleShape id="shoulders" stimulus={stimulus.shoulders}><Ellipse cx="51" cy="68" rx="13" ry="15" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth="2" /><Ellipse cx="99" cy="68" rx="13" ry="15" fill={fill('shoulders')} stroke={stroke('shoulders')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="back" stimulus={stimulus.back}><Path d="M57 58 Q75 48 93 58 L95 99 Q87 126 75 133 Q63 126 55 99 Z" fill={fill('back')} stroke={stroke('back')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="triceps" stimulus={stimulus.triceps}><Path d="M42 75 Q31 94 32 120 L45 123 Q51 98 55 80 Z" fill={fill('triceps')} stroke={stroke('triceps')} strokeWidth="2" /><Path d="M108 75 Q119 94 118 120 L105 123 Q99 98 95 80 Z" fill={fill('triceps')} stroke={stroke('triceps')} strokeWidth="2" /></MuscleShape>
          <Path d="M32 121 L30 160 Q35 168 42 160 L45 123 Z" fill="#4A4B50" /><Path d="M118 121 L120 160 Q115 168 108 160 L105 123 Z" fill="#4A4B50" />
          <MuscleShape id="glutes" stimulus={stimulus.glutes}><Path d="M55 136 Q74 130 74 164 Q60 172 52 157 Z" fill={fill('glutes')} stroke={stroke('glutes')} strokeWidth="2" /><Path d="M95 136 Q76 130 76 164 Q90 172 98 157 Z" fill={fill('glutes')} stroke={stroke('glutes')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="hamstrings" stimulus={stimulus.hamstrings}><Path d="M54 164 Q51 188 56 215 L72 215 L73 166 Z" fill={fill('hamstrings')} stroke={stroke('hamstrings')} strokeWidth="2" /><Path d="M96 164 Q99 188 94 215 L78 215 L77 166 Z" fill={fill('hamstrings')} stroke={stroke('hamstrings')} strokeWidth="2" /></MuscleShape>
          <MuscleShape id="calves" stimulus={stimulus.calves}><Path d="M55 217 L58 258 L70 258 L72 217 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth="2" /><Path d="M95 217 L92 258 L80 258 L78 217 Z" fill={fill('calves')} stroke={stroke('calves')} strokeWidth="2" /></MuscleShape>
        </Svg>
      </View></View>
      {!compact ? (
        <View style={styles.legend}>
          {(['rest', 'light', 'moderate', 'solid', 'very_high'] as const).map((band, index) => <View key={band} style={[styles.legendDot, { backgroundColor: bandColor[band] }]} accessibilityLabel={`刺激レベル${index}`} />)}
          <Text style={styles.legendText}>休息</Text><Text style={[styles.legendText, { marginLeft: 'auto' }]}>限界に近い</Text>
        </View>
      ) : null}
      {!compact ? (
        <View style={styles.scores}>
          {muscleIds.filter((id) => stimulus[id].score > 0).sort((a, b) => stimulus[b].score - stimulus[a].score).slice(0, 4).map((id) => (
            <View key={id} style={styles.scorePill}><Text style={styles.scoreText}>{muscleLabels[id]} {stimulus[id].score}%</Text></View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center' },
  compact: { transform: [{ scale: 0.82 }] },
  figures: { flexDirection: 'row', justifyContent: 'center' },
  figure: { alignItems: 'center' },
  figureLabel: { ...typography.caption, color: colors.textMuted, letterSpacing: 1.4, marginBottom: -4 },
  legend: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  legendDot: { width: 22, height: 6, borderRadius: 3 },
  legendText: { ...typography.caption, color: colors.textMuted, marginLeft: 4 },
  scores: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 12 },
  scorePill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  scoreText: { ...typography.caption, color: colors.textSecondary, fontVariant: ['tabular-nums'] },
});
