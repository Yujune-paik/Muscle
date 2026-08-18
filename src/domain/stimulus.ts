import { exerciseById } from '@/content';
import type { Difficulty, MuscleId, UserProfile, WorkoutSession } from '@/types';

export const muscleIds: MuscleId[] = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'core',
];

export const muscleLabels: Record<MuscleId, string> = {
  chest: '胸',
  back: '背中',
  shoulders: '肩',
  biceps: '上腕前',
  triceps: '上腕後',
  quadriceps: '太もも前',
  hamstrings: '太もも裏',
  glutes: 'お尻',
  calves: 'ふくらはぎ',
  core: '体幹',
};

export type StimulusBand = 'rest' | 'light' | 'moderate' | 'solid' | 'very_high';
export type MuscleStimulus = { score: number; band: StimulusBand; pain: boolean };

const effort: Record<Difficulty, number> = { easy: 0.75, good: 1, hard: 1.1 };

function focusRegions(profile: UserProfile): MuscleId[] {
  const focus: Record<UserProfile['focusMuscle'], MuscleId[]> = {
    chest: ['chest'],
    back: ['back'],
    shoulders: ['shoulders'],
    arms: ['biceps', 'triceps'],
    legs: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  };
  const goals: Record<UserProfile['goal'], MuscleId[]> = {
    lean_athletic: ['back', 'shoulders', 'chest'],
    v_taper: ['back', 'shoulders'],
    balanced_muscle: muscleIds,
    lower_body_athletic: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  };
  return [...new Set([...goals[profile.goal], ...focus[profile.focusMuscle]])];
}

export function weeklySetTarget(profile: UserProfile, muscle: MuscleId, completedSessions = 0): number {
  const established = profile.experience === 'regular' || completedSessions >= profile.weeklyFrequency * 4;
  const base = established ? 8 : 6;
  return focusRegions(profile).includes(muscle) ? Math.min(10, base + 2) : base;
}

function loadVolume(weight: number | null, reps: number, bodyWeightKg: number | null, bodyWeightFactor?: number) {
  const effectiveWeight = weight ?? (bodyWeightKg && bodyWeightFactor ? bodyWeightKg * bodyWeightFactor : 1);
  return effectiveWeight * reps;
}

function historicalVolumes(exerciseId: string, sessions: WorkoutSession[], profile: UserProfile): number[] {
  return sessions
    .flatMap((session) => session.items)
    .filter((item) => item.exerciseId === exerciseId && item.status === 'completed')
    .slice(0, 4)
    .map((item) => {
      const exercise = exerciseById[item.exerciseId];
      const logs = item.setLogs?.length ? item.setLogs : [{ weight: item.actualWeight, reps: item.actualReps }];
      return logs.reduce(
        (sum, log) => sum + loadVolume(log.weight, log.reps, profile.bodyWeightKg, exercise?.bodyWeightFactor),
        0,
      ) / logs.length;
    });
}

export function stimulusBand(score: number): StimulusBand {
  if (score <= 0) return 'rest';
  if (score < 25) return 'light';
  if (score < 50) return 'moderate';
  if (score < 75) return 'solid';
  return 'very_high';
}

export function calculateMuscleStimulus(
  session: WorkoutSession | undefined,
  history: WorkoutSession[],
  profile: UserProfile,
): Record<MuscleId, MuscleStimulus> {
  const dose = Object.fromEntries(muscleIds.map((id) => [id, 0])) as Record<MuscleId, number>;
  const pain = Object.fromEntries(muscleIds.map((id) => [id, false])) as Record<MuscleId, boolean>;

  session?.items.forEach((item) => {
    if (item.completedSets <= 0 && item.status !== 'completed') return;
    const exercise = exerciseById[item.exerciseId];
    if (!exercise) return;
    const logs = item.setLogs?.length
      ? item.setLogs
      : Array.from({ length: item.completedSets }, () => ({ weight: item.actualWeight, reps: item.actualReps }));
    const currentVolume = logs.length
      ? logs.reduce(
          (sum, log) => sum + loadVolume(log.weight, log.reps, profile.bodyWeightKg, exercise.bodyWeightFactor),
          0,
        ) / logs.length
      : 0;
    const previous = historicalVolumes(item.exerciseId, history, profile);
    const baseline = previous.length ? previous.reduce((sum, value) => sum + value, 0) / previous.length : currentVolume;
    const loadFactor = baseline > 0 ? Math.min(1.2, Math.max(0.8, currentVolume / baseline)) : 1;
    const effortFactor = effort[item.difficulty ?? 'good'];
    Object.entries(exercise.muscleContributions).forEach(([muscle, contribution]) => {
      const id = muscle as MuscleId;
      dose[id] += logs.length * (contribution ?? 0) * effortFactor * loadFactor;
      pain[id] ||= item.painReported;
    });
  });

  return Object.fromEntries(
    muscleIds.map((id) => {
      const perSessionTarget = weeklySetTarget(profile, id, history.length) / profile.weeklyFrequency;
      const score = Math.round(Math.min(100, perSessionTarget > 0 ? (75 * dose[id]) / perSessionTarget : 0));
      return [id, { score, band: stimulusBand(score), pain: pain[id] }];
    }),
  ) as Record<MuscleId, MuscleStimulus>;
}
