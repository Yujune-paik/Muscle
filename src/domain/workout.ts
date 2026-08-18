import { exerciseById, programs } from '@/content';
import type { EquipmentStatus, FocusMuscleId, ProgramTemplate, UnavailableReason, UserProfile, WorkoutItem } from '@/types';

const goalPrograms: Record<UserProfile['goal'], string[][]> = {
  lean_athletic: [
    ['chest_press', 'lat_pulldown', 'leg_press', 'seated_row', 'lateral_raise_machine', 'machine_crunch'],
    ['incline_press', 'seated_row', 'leg_curl', 'shoulder_press', 'glute_drive', 'standing_calf_raise'],
    ['pec_fly', 'lat_pulldown', 'leg_extension', 'reverse_fly', 'dumbbell_curl', 'machine_crunch'],
  ],
  v_taper: [
    ['lat_pulldown', 'chest_press', 'seated_row', 'lateral_raise_machine', 'cable_triceps_pushdown', 'leg_press'],
    ['seated_row', 'incline_press', 'shoulder_press', 'cable_lateral_raise', 'machine_biceps_curl', 'leg_curl'],
    ['lat_pulldown', 'pec_fly', 'reverse_fly', 'dumbbell_lateral_raise', 'dumbbell_curl', 'glute_drive'],
  ],
  balanced_muscle: [
    ['chest_press', 'lat_pulldown', 'leg_press', 'lateral_raise_machine', 'machine_biceps_curl', 'machine_crunch'],
    ['incline_press', 'seated_row', 'leg_curl', 'shoulder_press', 'cable_triceps_pushdown', 'standing_calf_raise'],
    ['pec_fly', 'lat_pulldown', 'glute_drive', 'reverse_fly', 'dumbbell_curl', 'machine_crunch'],
  ],
  lower_body_athletic: [
    ['leg_press', 'leg_curl', 'glute_drive', 'standing_calf_raise', 'chest_press', 'lat_pulldown'],
    ['goblet_squat', 'leg_extension', 'leg_curl', 'machine_crunch', 'seated_row', 'shoulder_press'],
    ['glute_drive', 'leg_press', 'standing_calf_raise', 'machine_crunch', 'incline_press', 'lat_pulldown'],
  ],
};

const focusExercise: Record<FocusMuscleId, string> = {
  chest: 'pec_fly',
  back: 'seated_row',
  shoulders: 'lateral_raise_machine',
  arms: 'cable_triceps_pushdown',
  legs: 'glute_drive',
};

const goalNames: Record<UserProfile['goal'], string> = {
  lean_athletic: 'Lean Athletic',
  v_taper: 'V-Taper',
  balanced_muscle: 'Balanced Muscle',
  lower_body_athletic: 'Lower Body Athletic',
};

export function selectProgram(frequency: 2 | 3, dayIndex: number): ProgramTemplate {
  const available = programs.filter((program) => (frequency === 2 ? program.dayIndex < 2 : true));
  return available[dayIndex % available.length] ?? programs[0]!;
}

export function selectPersonalizedProgram(profile: UserProfile, dayIndex: number): ProgramTemplate {
  const rotation = goalPrograms[profile.goal];
  const availableDays = profile.weeklyFrequency === 2 ? rotation.slice(0, 2) : rotation;
  const source = [...(availableDays[dayIndex % availableDays.length] ?? availableDays[0]!)];
  const maxExercises = profile.sessionDuration === 30 ? 4 : profile.sessionDuration === 45 ? 5 : 6;
  const focus = focusExercise[profile.focusMuscle];
  if (!source.includes(focus)) source[Math.min(source.length, maxExercises) - 1] = focus;
  const exerciseIds = source.slice(0, maxExercises);
  return {
    id: `${profile.goal}-${dayIndex % availableDays.length}`,
    name: `${goalNames[profile.goal]} ${String.fromCharCode(65 + (dayIndex % availableDays.length))}`,
    dayIndex: dayIndex % availableDays.length,
    exerciseIds,
    estimatedMinutes: Math.min(profile.sessionDuration, 8 + exerciseIds.length * 6),
  };
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
      setLogs: [],
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
