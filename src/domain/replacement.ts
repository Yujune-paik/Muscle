import { exerciseById, substitutions } from '@/content';
import type { EquipmentStatus, Exercise } from '@/types';

export function rankReplacements(
  sourceId: string,
  equipment: Record<string, EquipmentStatus>,
  completedExerciseIds: string[] = [],
  blockedExerciseIds: string[] = [],
): { exercise: Exercise; reason: string }[] {
  const rule = substitutions.find((entry) => entry.sourceId === sourceId);
  if (!rule) return [];

  return rule.candidates
    .map((candidate) => ({ ...candidate, exercise: exerciseById[candidate.exerciseId] }))
    .filter((candidate): candidate is typeof candidate & { exercise: Exercise } => Boolean(candidate.exercise))
    .filter((candidate) => equipment[candidate.exercise.equipmentId] !== 'absent')
    .filter((candidate) => !blockedExerciseIds.includes(candidate.exercise.id))
    .sort((a, b) => {
      const aUsed = completedExerciseIds.includes(a.exercise.id) ? 1 : 0;
      const bUsed = completedExerciseIds.includes(b.exercise.id) ? 1 : 0;
      const aKnown = equipment[a.exercise.equipmentId] === 'present' ? 0 : 1;
      const bKnown = equipment[b.exercise.equipmentId] === 'present' ? 0 : 1;
      return aUsed - bUsed || aKnown - bKnown || a.priority - b.priority;
    })
    .slice(0, 2)
    .map(({ exercise, reason }) => ({ exercise, reason }));
}

