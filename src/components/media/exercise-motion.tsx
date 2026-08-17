import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, radii, typography } from '@/design/tokens';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { Exercise } from '@/types';

export function SkeletonMedia() {
  const [pulse] = useState(() => new Animated.Value(0.35));
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);
  return <Animated.View style={[styles.root, { opacity: pulse }]} />;
}

export function ExerciseMotion({ exercise, failed = false }: { exercise: Exercise; failed?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [motion] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotion || failed) {
      motion.setValue(0.45);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(motion, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [failed, motion, reducedMotion]);

  const armShift = motion.interpolate({ inputRange: [0, 1], outputRange: [-18, 24] });
  const glowScale = motion.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.08] });

  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${exercise.name}。${exercise.altText}${reducedMotion ? '。動きを減らした表示' : ''}`}>
      <View style={styles.gridLineOne} />
      <View style={styles.gridLineTwo} />
      <Animated.View style={[styles.glow, { transform: [{ scale: glowScale }] }]} />
      <View style={styles.machineFrame} />
      <View style={styles.machineSeat} />
      <View style={styles.person}>
        <View style={styles.head} />
        <View style={styles.neck} />
        <View style={styles.torso}>
          <View style={[styles.muscle, exercise.targetId === 'chest' && styles.muscleChest]} />
          <View style={[styles.muscle, exercise.targetId === 'back' && styles.muscleBack]} />
          <View style={[styles.muscle, exercise.targetId === 'shoulders' && styles.muscleShoulder]} />
        </View>
        <Animated.View style={[styles.arm, styles.armLeft, { transform: [{ translateX: armShift }, { rotate: '-14deg' }] }]} />
        <Animated.View style={[styles.arm, styles.armRight, { transform: [{ translateX: armShift }, { rotate: '14deg' }] }]} />
        <View style={styles.hips} />
        <View style={[styles.leg, styles.legLeft, exercise.targetId === 'legs' && styles.legActive]} />
        <View style={[styles.leg, styles.legRight, exercise.targetId === 'legs' && styles.legActive]} />
      </View>
      <View style={styles.captionRow}>
        <View style={styles.liveDot} />
        <Text style={styles.caption}>{failed ? '開始・終了姿勢' : reducedMotion ? '動きを減らして表示中' : 'LOOP PREVIEW'}</Text>
      </View>
    </View>
  );
}

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
    minHeight: 330,
    borderRadius: radii.media,
    overflow: 'hidden',
    backgroundColor: '#111113',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLineOne: { position: 'absolute', width: '130%', height: 1, backgroundColor: '#29292D', transform: [{ rotate: '-16deg' }] },
  gridLineTwo: { position: 'absolute', width: 1, height: '130%', backgroundColor: '#242428', transform: [{ rotate: '24deg' }] },
  glow: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(215,255,74,0.08)' },
  machineFrame: { position: 'absolute', width: 220, height: 220, borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 8, borderColor: '#38383D', borderRadius: 22 },
  machineSeat: { position: 'absolute', bottom: 72, width: 94, height: 12, borderRadius: 6, backgroundColor: '#4A4A50' },
  person: { width: 150, height: 260, alignItems: 'center', position: 'relative' },
  head: { width: 42, height: 48, borderRadius: 21, backgroundColor: '#77777E', marginTop: 8 },
  neck: { width: 22, height: 12, backgroundColor: '#66666D' },
  torso: { width: 82, height: 96, borderTopLeftRadius: 32, borderTopRightRadius: 32, borderBottomLeftRadius: 18, borderBottomRightRadius: 18, backgroundColor: '#58585F' },
  muscle: { position: 'absolute', opacity: 0 },
  muscleChest: { opacity: 1, left: 10, top: 10, width: 62, height: 30, borderRadius: 16, backgroundColor: colors.muscle },
  muscleBack: { opacity: 1, left: 7, top: 18, width: 68, height: 48, borderRadius: 22, backgroundColor: colors.muscle },
  muscleShoulder: { opacity: 1, left: -4, top: 6, width: 90, height: 22, borderRadius: 12, backgroundColor: colors.muscle },
  arm: { position: 'absolute', top: 80, width: 24, height: 98, borderRadius: 14, backgroundColor: '#66666D' },
  armLeft: { left: 16 },
  armRight: { right: 16 },
  hips: { width: 66, height: 30, borderRadius: 15, backgroundColor: '#4E4E54' },
  leg: { position: 'absolute', top: 188, width: 30, height: 70, borderRadius: 16, backgroundColor: '#55555B' },
  legLeft: { left: 38, transform: [{ rotate: '6deg' }] },
  legRight: { right: 38, transform: [{ rotate: '-6deg' }] },
  legActive: { backgroundColor: colors.muscle },
  captionRow: { position: 'absolute', left: 18, bottom: 16, flexDirection: 'row', alignItems: 'center', gap: 7 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  caption: { ...typography.caption, color: colors.textSecondary, letterSpacing: 1.1 },
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
