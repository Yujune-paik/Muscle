import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { BottomSheet, InlineError, SmoothPressable } from '@/components/primitives';
import { exerciseMediaById } from '@/content/exercise-media';
import { colors, radii, typography } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { Exercise } from '@/types';
import { YouTubeEmbed } from './youtube-embed';

export function SkeletonMedia() {
  return <View accessibilityLabel="画像を読み込み中" style={[styles.root, styles.skeleton]} />;
}

function Pose({
  label,
  uri,
  accessibilityLabel,
  transition,
  onError,
}: {
  label: string;
  uri: string;
  accessibilityLabel: string;
  transition: number;
  onError: () => void;
}) {
  return (
    <View style={styles.pose}>
      <Image
        source={{ uri }}
        accessibilityLabel={accessibilityLabel}
        style={styles.poseImage}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={transition}
        onError={onError}
      />
      <View style={styles.poseLabel}><Text style={styles.poseLabelText}>{label}</Text></View>
    </View>
  );
}

export function ExerciseMedia({ exercise, failed = false }: { exercise: Exercise; failed?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [poseFailed, setPoseFailed] = useState(failed);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeFailed, setYoutubeFailed] = useState(false);
  const spec = exerciseMediaById[exercise.id];
  const youtube = spec?.youtube;

  return (
    <>
      <View style={styles.root}>
        {spec && !poseFailed ? (
          <View
            style={styles.poseRow}
            accessible
            accessibilityRole="image"
            accessibilityLabel={`${exercise.name}。${exercise.altText}。開始姿勢と終了姿勢`}>
            <Pose
              label="開始"
              uri={spec.posePair.startUri}
              accessibilityLabel={`${exercise.name}の開始姿勢`}
              transition={reducedMotion ? 0 : 160}
              onError={() => setPoseFailed(true)}
            />
            <View style={styles.direction}>
              <MaterialCommunityIcons name="arrow-right" size={20} color={colors.accent} />
            </View>
            <Pose
              label="終了"
              uri={spec.posePair.endUri}
              accessibilityLabel={`${exercise.name}の終了姿勢`}
              transition={reducedMotion ? 0 : 160}
              onError={() => setPoseFailed(true)}
            />
          </View>
        ) : (
          <View
            style={styles.fallback}
            accessible
            accessibilityRole="image"
            accessibilityLabel={`${exercise.name}。${exercise.altText}。開始姿勢と終了姿勢`}>
            <MaterialCommunityIcons name="human-male" size={48} color={colors.textMuted} />
            <Text style={styles.fallbackTitle}>開始・終了姿勢</Text>
            <Text style={styles.fallbackText}>{exercise.altText}</Text>
          </View>
        )}
        <View style={styles.mediaFooter}>
          <View style={styles.sourceRow}>
            <View style={styles.liveDot} />
            <Text style={styles.sourceText}>実写ポーズ</Text>
          </View>
          {youtube ? (
            <SmoothPressable
              accessibilityRole="button"
              accessibilityLabel={`${exercise.name}の実演動画を見る`}
              onPress={() => { setYoutubeFailed(false); setYoutubeOpen(true); }}
              style={styles.videoButton}
              testID="exercise-video-open">
              <MaterialCommunityIcons name="youtube" size={19} color={colors.textPrimary} />
              <Text style={styles.videoButtonText}>実演を見る</Text>
            </SmoothPressable>
          ) : (
            <Text style={styles.noVideo}>姿勢とポイントで確認</Text>
          )}
        </View>
      </View>

      {youtube ? (
        <BottomSheet visible={youtubeOpen} title="動きを動画で確認" onClose={() => setYoutubeOpen(false)}>
          {youtubeFailed ? (
            <InlineError
              message="動画を読み込めませんでした。開始・終了姿勢を確認してください。"
              onRetry={() => setYoutubeFailed(false)}
            />
          ) : youtubeOpen ? (
            <View style={styles.videoFrame} testID="youtube-player">
              <YouTubeEmbed videoId={youtube.videoId} title={youtube.title} onError={() => setYoutubeFailed(true)} />
            </View>
          ) : null}
          <Text style={styles.videoTitle}>{youtube.title}</Text>
          <Text style={styles.videoMeta}>提供: {youtube.channel} · YouTube</Text>
          <Text style={styles.videoNote}>通信環境で再生します。痛みがある場合は中止し、ジムスタッフへ確認してください。</Text>
          <SmoothPressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${youtube.videoId}`)}
            style={styles.youtubeLink}>
            <Text style={styles.youtubeLinkText}>YouTubeで開く</Text>
            <MaterialCommunityIcons name="open-in-new" size={16} color={colors.textSecondary} />
          </SmoothPressable>
        </BottomSheet>
      ) : null}
    </>
  );
}

/** @deprecated Use ExerciseMedia. Kept for compatibility with older callers. */
export const ExerciseMotion = ExerciseMedia;

export function BodyMap({ muscles = ['chest', 'back', 'legs'] }: { muscles?: Exercise['targetId'][] }) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`鍛えた部位: ${muscles.join('、')}`} style={styles.bodyMap}>
      <View style={styles.mapGlow} />
      <View style={styles.mapPerson}>
        <View style={styles.mapHead} />
        <View style={[styles.mapTorso, muscles.includes('chest') && styles.mapActive]}>
          {muscles.includes('back') ? <View style={styles.backMark} /> : null}
        </View>
        <View style={[styles.mapArm, styles.mapArmLeft, muscles.includes('shoulders') && styles.mapActive]} />
        <View style={[styles.mapArm, styles.mapArmRight, muscles.includes('shoulders') && styles.mapActive]} />
        <View style={[styles.mapLeg, styles.mapLegLeft, muscles.includes('legs') && styles.mapActive]} />
        <View style={[styles.mapLeg, styles.mapLegRight, muscles.includes('legs') && styles.mapActive]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 304,
    borderRadius: radii.media,
    overflow: 'hidden',
    backgroundColor: '#111113',
    borderWidth: 1,
    borderColor: colors.border,
  },
  skeleton: { backgroundColor: colors.surfaceRaised },
  poseRow: { height: 246, flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#F2F2F0' },
  pose: { flex: 1, position: 'relative', backgroundColor: '#F2F2F0' },
  poseImage: { width: '100%', height: '100%' },
  poseLabel: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(10,10,11,0.82)' },
  poseLabelText: { ...typography.caption, color: colors.textPrimary, fontWeight: '700' },
  direction: { width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#151516' },
  fallback: { height: 246, padding: 28, alignItems: 'center', justifyContent: 'center' },
  fallbackTitle: { ...typography.heading, color: colors.textPrimary, marginTop: 10 },
  fallbackText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
  mediaFooter: { minHeight: 56, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  sourceText: { ...typography.caption, color: colors.textSecondary, letterSpacing: 0.8 },
  videoButton: { minHeight: 40, paddingHorizontal: 13, borderRadius: 999, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 7 },
  videoButtonText: { ...typography.label, color: colors.textPrimary },
  noVideo: { ...typography.caption, color: colors.textMuted },
  videoFrame: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden', borderRadius: radii.compact, backgroundColor: '#000000' },
  videoTitle: { ...typography.label, color: colors.textPrimary, marginTop: 14 },
  videoMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  videoNote: { ...typography.caption, color: colors.textMuted, marginTop: 12 },
  youtubeLink: { minHeight: 46, marginTop: 8, marginBottom: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  youtubeLinkText: { ...typography.label, color: colors.textSecondary },
  bodyMap: { height: 240, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mapGlow: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,90,95,0.08)' },
  mapPerson: { width: 120, height: 220, alignItems: 'center' },
  mapHead: { width: 38, height: 42, borderRadius: 20, backgroundColor: '#55555C' },
  mapTorso: { width: 68, height: 82, borderRadius: 26, backgroundColor: '#4A4A50', marginTop: 6 },
  mapActive: { backgroundColor: colors.muscle },
  backMark: { width: 30, height: 42, borderRadius: 15, backgroundColor: '#FF8589', alignSelf: 'center', marginTop: 14 },
  mapArm: { position: 'absolute', top: 54, width: 20, height: 92, borderRadius: 10, backgroundColor: '#4A4A50' },
  mapArmLeft: { left: 8, transform: [{ rotate: '7deg' }] },
  mapArmRight: { right: 8, transform: [{ rotate: '-7deg' }] },
  mapLeg: { position: 'absolute', top: 132, width: 25, height: 86, borderRadius: 13, backgroundColor: '#4A4A50' },
  mapLegLeft: { left: 31 },
  mapLegRight: { right: 31 },
});
