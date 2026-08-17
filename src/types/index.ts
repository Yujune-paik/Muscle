export type ExperienceLevel = 'first' | 'some' | 'regular';
export type Difficulty = 'easy' | 'good' | 'hard';
export type EquipmentStatus = 'unknown' | 'present' | 'absent';
export type UnavailableReason = 'busy' | 'absent' | 'skip';
export type MuscleId = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms';
export type MovementPattern =
  | 'horizontal_push'
  | 'vertical_pull'
  | 'knee_dominant'
  | 'horizontal_pull'
  | 'shoulder_isolation'
  | 'vertical_push'
  | 'leg_isolation';

export type Exercise = {
  id: string;
  name: string;
  nameEn: string;
  equipmentId: string;
  equipmentName: string;
  target: string;
  targetId: MuscleId;
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
  goal: 'lean_athletic';
  experience: ExperienceLevel;
  weeklyFrequency: 2 | 3;
  sessionDuration: 30 | 45 | 60;
  gymName: string;
  proteinMode: 'daily' | 'training_days' | 'off';
  proteinGrams: number;
  proteinTiming: 'post_workout' | 'morning' | 'evening';
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
};

export type ProteinLog = {
  localDate: string;
  completedAt: string;
  grams: number;
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

