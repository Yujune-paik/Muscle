import { exerciseById, programs } from '@/content';
import type { EquipmentStatus, ProgramTemplate, UnavailableReason, WorkoutItem } from '@/types';

export function selectProgram(frequency: 2 | 3, dayIndex: number): ProgramTemplate {
  const available = programs.filter((program) => (frequency === 2 ? program.dayIndex < 2 : true));
  return available[dayIndex % available.length] ?? programs[0]!;
}

export function buildWorkoutItems(program: ProgramTemplate): WorkoutItem[] {
  return program.exerciseIds.map((exerciseId, index) => {
    const exercise = exerciseById[exerciseId]!;
    return {
      id: `item-${index}`,
      exerciseId,
      status: index === 0 ? 'active' : 'pending',
      plannedWeight: exercise.weight,
      plannedReps: exercise.reps,
      plannedSets: exercise.sets,
      completedSets: 0,
      actualWeight: exercise.weight,
      actualReps: exercise.reps,
      painReported: false,
    };
  });
}

export function copyPlannedToActual(item: WorkoutItem): WorkoutItem {
  return {
    ...item,
    actualWeight: item.plannedWeight,
    actualReps: item.plannedReps,
  };
}

export function updateEquipmentStatus(
  current: EquipmentStatus,
  reason: UnavailableReason | 'completed',
): EquipmentStatus {
  if (reason === 'absent') return 'absent';
  if (reason === 'completed') return 'present';
  return current;
}

