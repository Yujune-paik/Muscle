import { z } from 'zod';

import exercisesJson from './exercises.ja.json';
import programsJson from './programs.json';
import substitutionsJson from './substitutions.json';
import type { Exercise, MuscleId, ProgramTemplate, SubstitutionRule } from '@/types';

const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),
  equipmentId: z.string(),
  equipmentName: z.string(),
  target: z.string(),
  targetId: z.string(),
  muscleContributions: z.record(z.string(), z.number()).optional(),
  bodyWeightFactor: z.number().positive().optional(),
  movement: z.enum([
    'horizontal_push',
    'vertical_pull',
    'knee_dominant',
    'horizontal_pull',
    'shoulder_isolation',
    'vertical_push',
    'leg_isolation',
    'arm_isolation',
    'hip_dominant',
    'calf_isolation',
    'core_flexion',
  ]),
  weight: z.number().nullable(),
  reps: z.number().int().positive(),
  sets: z.number().int().positive(),
  restSeconds: z.number().int().positive(),
  increment: z.number().positive().nullable(),
  repMin: z.number().int().positive(),
  repMax: z.number().int().positive(),
  cues: z.tuple([z.string(), z.string()]),
  altText: z.string(),
});

type ExerciseSource = z.infer<typeof exerciseSchema>;

function defaultContributions(exercise: ExerciseSource): Partial<Record<MuscleId, number>> {
  if (exercise.muscleContributions) return exercise.muscleContributions as Partial<Record<MuscleId, number>>;
  if (exercise.movement === 'horizontal_push') return { chest: 1, triceps: 0.5, shoulders: 0.25 };
  if (exercise.movement === 'vertical_pull' || exercise.movement === 'horizontal_pull') {
    return exercise.id === 'reverse_fly' ? { shoulders: 1, back: 0.5 } : { back: 1, biceps: 0.5 };
  }
  if (exercise.movement === 'vertical_push') return { shoulders: 1, triceps: 0.5 };
  if (exercise.movement === 'shoulder_isolation') return { shoulders: 1 };
  if (exercise.movement === 'knee_dominant') return { quadriceps: 1, glutes: 0.5, hamstrings: 0.25, core: 0.25 };
  if (exercise.id === 'leg_curl') return { hamstrings: 1 };
  return { quadriceps: 1 };
}

function normalizedTarget(exercise: ExerciseSource): MuscleId {
  if (exercise.targetId !== 'legs') return exercise.targetId as MuscleId;
  return exercise.id === 'leg_curl' ? 'hamstrings' : 'quadriceps';
}

export const exercises = z.array(exerciseSchema).parse(exercisesJson).map((exercise) => ({
  ...exercise,
  targetId: normalizedTarget(exercise),
  muscleContributions: defaultContributions(exercise),
})) as Exercise[];
export const programs = programsJson as ProgramTemplate[];
export const substitutions = substitutionsJson as SubstitutionRule[];

export const exerciseById = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise]));
