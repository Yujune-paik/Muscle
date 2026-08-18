import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { InlineError, SmoothPressable } from '@/components/primitives';
import { exerciseMediaById } from '@/content/exercise-media';
import { colors, radii, typography } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { Exercise, MuscleId } from '@/types';
import { YouTubeEmbed } from './youtube-embed';

export function SkeletonMedia() {
  return <View accessibilityLabel="動画を読み込み中" style={[styles.root, styles.skeleton]} />;
}

function Pose({ label, uri, accessibilityLabel, transition, onError }: { label: string; uri: string; accessibilityLabel: string; transition: number; onError: () => void }) {
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
  const [playing, setPlaying] = useState(false);
  const [youtubeFailed, setYoutubeFailed] = useState(false);
  const [posesOpen, setPosesOpen] = useState(false);
  const spec = exerciseMediaById[exercise.id];
  const youtube = spec?.youtube;

  return (
    <View style={styles.root}>
      <View style={styles.videoFrame} testID={playing ? 'youtube-player' : undefined}>
        {youtube && playing && !youtubeFailed ? (
          <YouTubeEmbed videoId={youtube.videoId} title={youtube.title} onError={() => setYoutubeFailed(true)} />
        ) : youtube && !youtubeFailed ? (
          <SmoothPressable
            accessibilityRole="button"
            accessibilityLabel={`${exercise.name}の動作動画を再生`}
            onPress={() => setPlaying(true)}
            style={styles.posterButton}
            testID="exercise-video-open">
            <Image
              source={{ uri: `https://img.youtube.com/vi/${youtube.videoId}/hqdefault.jpg` }}
              accessibilityLabel={`${exercise.name} 動作動画のサムネイル`}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={reducedMotion ? 0 : 180}
            />
            <View style={styles.posterScrim} />
            <View style={styles.playButton}>
              <MaterialCommunityIcons name="play" size={34} color={colors.onAccent} />
            </View>
          </SmoothPressable>
        ) : (
          <View style={styles.videoFallback}>
            <InlineError message="動画を読み込めませんでした。姿勢写真またはYouTubeで確認してください。" onRetry={() => { setYoutubeFailed(false); setPlaying(false); }} />
          </View>
        )}
      </View>

      <View style={styles.mediaFooter}>
        <View style={{ flex: 1 }}>
          <Text style={styles.videoTitle}>{youtube?.title ?? `${exercise.name}のフォームガイド`}</Text>
          <Text style={styles.videoMeta}>{youtube ? `${youtube.channel} · YouTube` : exercise.altText}</Text>
        </View>
        {youtube ? (
          <SmoothPressable
            accessibilityRole="link"
            accessibilityLabel="YouTubeで開く"
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${youtube.videoId}`)}
            style={styles.externalButton}>
            <MaterialCommunityIcons name="open-in-new" size={18} color={colors.textSecondary} />
          </SmoothPressable>
        ) : null}
      </View>

      <SmoothPressable
        accessibilityRole="button"
        accessibilityState={{ expanded: posesOpen }}
        onPress={() => setPosesOpen((open) => !open)}
        style={styles.poseToggle}>
        <View style={styles.poseToggleIcon}><MaterialCommunityIcons name="image-multiple-outline" size={19} color={colors.accent} /></View>
        <Text style={styles.poseToggleText}>開始・終了姿勢も見る</Text>
        <MaterialCommunityIcons name={posesOpen ? 'chevron-up' : 'chevron-down'} size={21} color={colors.textSecondary} />
      </SmoothPressable>

      {posesOpen ? (
        spec && !poseFailed ? (
          <View style={styles.poseRow} accessible accessibilityRole="image" accessibilityLabel={`${exercise.name}。${exercise.altText}。開始姿勢と終了姿勢`}>
            <Pose label="開始" uri={spec.posePair.startUri} accessibilityLabel={`${exercise.name}の開始姿勢`} transition={reducedMotion ? 0 : 160} onError={() => setPoseFailed(true)} />
            <View style={styles.direction}><MaterialCommunityIcons name="arrow-right" size={20} color={colors.accent} /></View>
            <Pose label="終了" uri={spec.posePair.endUri} accessibilityLabel={`${exercise.name}の終了姿勢`} transition={reducedMotion ? 0 : 160} onError={() => setPoseFailed(true)} />
          </View>
        ) : (
          <View style={styles.fallback} accessible accessibilityRole="image" accessibilityLabel={`${exercise.name}。${exercise.altText}`}>
            <MaterialCommunityIcons name="human-male" size={42} color={colors.textMuted} />
            <Text style={styles.fallbackText}>{exercise.altText}</Text>
          </View>
        )
      ) : null}
    </View>
  );
}

/** @deprecated Use ExerciseMedia. Kept for compatibility with older callers. */
export const ExerciseMotion = ExerciseMedia;

export function BodyMap({ muscles = ['chest', 'back', 'shoulders'] }: { muscles?: MuscleId[] }) {
  const armsActive = muscles.some((muscle) => muscle === 'biceps' || muscle === 'triceps' || muscle === 'shoulders');
  const legsActive = muscles.some((muscle) => ['quadriceps', 'hamstrings', 'glutes', 'calves'].includes(muscle));
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`鍛えた部位: ${muscles.join('、')}`} style={styles.bodyMap}>
      <View style={styles.mapGlow} />
      <View style={styles.mapPerson}>
        <View style={styles.mapHead} />
        <View style={[styles.mapTorso, muscles.some((muscle) => muscle === 'chest' || muscle === 'back' || muscle === 'core') && styles.mapActive]} />
        <View style={[styles.mapArm, styles.mapArmLeft, armsActive && styles.mapActive]} />
        <View style={[styles.mapArm, styles.mapArmRight, armsActive && styles.mapActive]} />
        <View style={[styles.mapLeg, styles.mapLegLeft, legsActive && styles.mapActive]} />
        <View style={[styles.mapLeg, styles.mapLegRight, legsActive && styles.mapActive]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { borderRadius: radii.media, overflow: 'hidden', backgroundColor: '#111113', borderWidth: 1, borderColor: colors.border },
  skeleton: { minHeight: 304, backgroundColor: colors.surfaceRaised },
  videoFrame: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden', backgroundColor: '#050505' },
  posterButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  posterScrim: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.28)' },
  playButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', paddingLeft: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 18 },
  videoFallback: { flex: 1, justifyContent: 'center', padding: 18 },
  mediaFooter: { minHeight: 70, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  videoTitle: { ...typography.label, color: colors.textPrimary },
  videoMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 3 },
  externalButton: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  poseToggle: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10 },
  poseToggleIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#25291D', alignItems: 'center', justifyContent: 'center' },
  poseToggleText: { ...typography.label, color: colors.textPrimary, flex: 1 },
  poseRow: { height: 230, flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#F2F2F0', borderTopWidth: 1, borderTopColor: colors.border },
  pose: { flex: 1, position: 'relative', backgroundColor: '#F2F2F0' },
  poseImage: { width: '100%', height: '100%' },
  poseLabel: { position: 'absolute', top: 10, left: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(10,10,11,0.82)' },
  poseLabelText: { ...typography.caption, color: colors.textPrimary, fontWeight: '700' },
  direction: { width: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#151516' },
  fallback: { minHeight: 170, padding: 24, alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.border },
  fallbackText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
  bodyMap: { height: 240, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mapGlow: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,90,95,0.08)' },
  mapPerson: { width: 120, height: 220, alignItems: 'center' },
  mapHead: { width: 38, height: 42, borderRadius: 20, backgroundColor: '#55555C' },
  mapTorso: { width: 68, height: 82, borderRadius: 26, backgroundColor: '#4A4A50', marginTop: 6 },
  mapActive: { backgroundColor: colors.muscle },
  mapArm: { position: 'absolute', top: 54, width: 20, height: 92, borderRadius: 10, backgroundColor: '#4A4A50' },
  mapArmLeft: { left: 8, transform: [{ rotate: '7deg' }] },
  mapArmRight: { right: 8, transform: [{ rotate: '-7deg' }] },
  mapLeg: { position: 'absolute', top: 132, width: 25, height: 86, borderRadius: 13, backgroundColor: '#4A4A50' },
  mapLegLeft: { left: 31 },
  mapLegRight: { right: 31 },
});
