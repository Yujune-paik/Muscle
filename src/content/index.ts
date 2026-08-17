import { z } from 'zod';

import exercisesJson from './exercises.ja.json';
import programsJson from './programs.json';
import substitutionsJson from './substitutions.json';
import type { Exercise, ProgramTemplate, SubstitutionRule } from '@/types';

const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),
  equipmentId: z.string(),
  equipmentName: z.string(),
  target: z.string(),
  targetId: z.enum(['chest', 'back', 'legs', 'shoulders', 'arms']),
  movement: z.enum([
    'horizontal_push',
    'vertical_pull',
    'knee_dominant',
    'horizontal_pull',
    'shoulder_isolation',
    'vertical_push',
    'leg_isolation',
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

export const exercises = z.array(exerciseSchema).parse(exercisesJson) as Exercise[];
export const programs = programsJson as ProgramTemplate[];
export const substitutions = substitutionsJson as SubstitutionRule[];

export const exerciseById = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise]));

