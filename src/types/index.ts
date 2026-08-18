export type ExperienceLevel = 'first' | 'some' | 'regular';
export type Difficulty = 'easy' | 'good' | 'hard';
export type EquipmentStatus = 'unknown' | 'present' | 'absent';
export type UnavailableReason = 'busy' | 'absent' | 'skip';
export type PhysiqueGoalId = 'lean_athletic' | 'v_taper' | 'balanced_muscle' | 'lower_body_athletic';
export type FocusMuscleId = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs';
export type MuscleId =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core';
export type ProteinMealCoverage = 'low' | 'medium' | 'high' | 'unknown';
export type NutritionSafetyStatus = 'standard' | 'consult';
export type ProteinTiming = 'post_workout' | 'morning' | 'evening';
export type SleepBand = 'under_6' | 'six_to_seven' | 'seven_plus';
export type SorenessLevel = 'none' | 'some' | 'high';
export type XpEventType = 'workout' | 'protein_plan' | 'recovery_check';
export type MovementPattern =
  | 'horizontal_push'
  | 'vertical_pull'
  | 'knee_dominant'
  | 'horizontal_pull'
  | 'shoulder_isolation'
  | 'vertical_push'
  | 'leg_isolation'
  | 'arm_isolation'
  | 'hip_dominant'
  | 'calf_isolation'
  | 'core_flexion';

export type Exercise = {
  id: string;
  name: string;
  nameEn: string;
  equipmentId: string;
  equipmentName: string;
  target: string;
  targetId: MuscleId;
  muscleContributions: Partial<Record<MuscleId, number>>;
  bodyWeightFactor?: number;
  movement: MovementPattern;
  weight: number | null;
  reps: number;
  sets: number;
  restSeconds: number;
  increment: number | null;
  repMin: number;
  repMax: number;
  cues: [string, string];
  altText: string;
};

export type ExerciseMediaSpec = {
  posePair: {
    startUri: string;
    endUri: string;
    sourceName: string;
    sourceUrl: string;
    license: string;
  };
  youtube?: {
    videoId: string;
    title: string;
    channel: string;
    reviewedAt: string;
  };
};

export type ProgramTemplate = {
  id: string;
  name: string;
  dayIndex: number;
  exerciseIds: string[];
  estimatedMinutes: number;
};

export type SubstitutionRule = {
  sourceId: string;
  candidates: { exerciseId: string; reason: string; priority: number }[];
};

export type UserProfile = {
  goal: PhysiqueGoalId;
  focusMuscle: FocusMuscleId;
  experience: ExperienceLevel;
  weeklyFrequency: 2 | 3;
  sessionDuration: 30 | 45 | 60;
  gymName: string;
  bodyWeightKg: number | null;
  heightCm: number | null;
  proteinMealCoverage: ProteinMealCoverage;
  nutritionSafetyStatus: NutritionSafetyStatus;
  proteinMode: 'daily' | 'training_days' | 'off';
  proteinGrams: number;
  proteinTiming: ProteinTiming;
};

export type SetLog = {
  id: string;
  completedAt: string;
  weight: number | null;
  reps: number;
};

export type RecoveryCheck = {
  localDate: string;
  sleep: SleepBand;
  soreness: SorenessLevel;
  adjustmentAccepted: boolean;
};

export type WorkoutItem = {
  id: string;
  exerciseId: string;
  originalExerciseId?: string;
  replacementReason?: UnavailableReason;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  plannedWeight: number | null;
  plannedReps: number;
  plannedSets: number;
  completedSets: number;
  setLogs: SetLog[];
  actualWeight: number | null;
  actualReps: number;
  difficulty?: Difficulty;
  painReported: boolean;
  painLocation?: string;
  painSeverity?: 'mild' | 'persistent' | 'severe';
};

export type WorkoutSession = {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'completed';
  currentItemIndex: number;
  items: WorkoutItem[];
  startedAt: string;
  completedAt?: string;
  restEndAt?: number;
  busyEquipmentIds: string[];
  estimatedMinutes: number;
  recoveryCheck?: RecoveryCheck;
};

export type ProteinLog = {
  id: string;
  localDate: string;
  completedAt: string;
  grams: number;
};

export type XpEvent = {
  id: string;
  localDate: string;
  createdAt: string;
  type: XpEventType;
  xp: number;
  sourceId: string;
};

export type ProgressionState = {
  weight: number | null;
  reps: number;
  repMin: number;
  repMax: number;
  increment: number | null;
  topRangeCount: number;
};

export type SyncEvent = {
  clientEventId: string;
  createdAt: string;
  type: string;
  payload: Record<string, unknown>;
};
