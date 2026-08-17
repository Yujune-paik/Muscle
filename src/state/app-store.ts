import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { exerciseById } from '@/content';
import { getNextPrescription } from '@/domain/progression';
import { buildWorkoutItems, selectProgram } from '@/domain/workout';
import { appStorage } from '@/data/storage';
import type {
  Difficulty,
  EquipmentStatus,
  ProteinLog,
  UnavailableReason,
  UserProfile,
  WorkoutSession,
} from '@/types';
import { localDateKey } from '@/utils/units';

type NextPrescription = { weight: number | null; reps: number; reason: string };

type AppState = {
  hydrated: boolean;
  onboardingCompleted: boolean;
  profile: UserProfile;
  activeSession: WorkoutSession | null;
  completedSessions: WorkoutSession[];
  equipment: Record<string, EquipmentStatus>;
  proteinLogs: ProteinLog[];
  nextPrescriptions: Record<string, NextPrescription>;
  setHydrated: (value: boolean) => void;
  updateProfile: (values: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  startWorkout: () => WorkoutSession;
  completeSet: (itemId: string) => void;
  updatePrescription: (itemId: string, values: { weight?: number | null; reps?: number }) => void;
  submitFeedback: (
    itemId: string,
    difficulty: Difficulty,
    pain?: { reported: boolean; location?: string; severity?: 'mild' | 'persistent' | 'severe' },
  ) => void;
  setUnavailableReason: (itemId: string, reason: UnavailableReason) => void;
  replaceExercise: (itemId: string, exerciseId: string, reason: Exclude<UnavailableReason, 'skip'>) => void;
  skipExercise: (itemId: string) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  discardWorkout: () => void;
  clearRest: () => void;
  extendRest: (seconds: number) => void;
  returnHome: () => void;
  logProtein: () => void;
  resetAll: () => void;
};

const defaultProfile: UserProfile = {
  goal: 'lean_athletic',
  experience: 'first',
  weeklyFrequency: 3,
  sessionDuration: 45,
  gymName: 'Demo Gym',
  proteinMode: 'daily',
  proteinGrams: 25,
  proteinTiming: 'post_workout',
};

function markSessionComplete(session: WorkoutSession): WorkoutSession {
  return { ...session, status: 'completed', completedAt: new Date().toISOString(), restEndAt: undefined };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingCompleted: false,
      profile: defaultProfile,
      activeSession: null,
      completedSessions: [],
      equipment: {},
      proteinLogs: [],
      nextPrescriptions: {},
      setHydrated: (value) => set({ hydrated: value }),
      updateProfile: (values) => set((state) => ({ profile: { ...state.profile, ...values } })),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      startWorkout: () => {
        const current = get().activeSession;
        if (current && current.status !== 'completed') {
          const resumed = { ...current, status: 'active' as const };
          set({ activeSession: resumed });
          return resumed;
        }
        const { profile, completedSessions, nextPrescriptions } = get();
        const program = selectProgram(profile.weeklyFrequency, completedSessions.length);
        const items = buildWorkoutItems(program).map((item) => {
          const next = nextPrescriptions[item.exerciseId];
          return next
            ? { ...item, plannedWeight: next.weight, actualWeight: next.weight, plannedReps: next.reps, actualReps: next.reps }
            : item;
        });
        const session: WorkoutSession = {
          id: `session-${Date.now()}`,
          title: program.name,
          status: 'active',
          currentItemIndex: 0,
          items,
          startedAt: new Date().toISOString(),
          busyEquipmentIds: [],
          estimatedMinutes: program.estimatedMinutes,
        };
        set({ activeSession: session });
        return session;
      },
      completeSet: (itemId) =>
        set((state) => {
          if (!state.activeSession) return state;
          const item = state.activeSession.items.find((entry) => entry.id === itemId);
          if (!item || item.completedSets >= item.plannedSets) return state;
          const completedSets = item.completedSets + 1;
          const items = state.activeSession.items.map((entry) =>
            entry.id === itemId ? { ...entry, completedSets, status: 'active' as const } : entry,
          );
          const restSeconds = exerciseById[item.exerciseId]?.restSeconds ?? 60;
          return {
            activeSession: {
              ...state.activeSession,
              items,
              restEndAt: completedSets < item.plannedSets ? Date.now() + restSeconds * 1000 : undefined,
            },
          };
        }),
      updatePrescription: (itemId, values) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              items: state.activeSession.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      plannedWeight: values.weight === undefined ? item.plannedWeight : values.weight,
                      actualWeight: values.weight === undefined ? item.actualWeight : values.weight,
                      plannedReps: values.reps ?? item.plannedReps,
                      actualReps: values.reps ?? item.actualReps,
                    }
                  : item,
              ),
            },
          };
        }),
      submitFeedback: (itemId, difficulty, pain = { reported: false }) =>
        set((state) => {
          const session = state.activeSession;
          if (!session) return state;
          const index = session.items.findIndex((item) => item.id === itemId);
          const item = session.items[index];
          if (!item) return state;
          const exercise = exerciseById[item.exerciseId];
          if (!exercise) return state;
          const progression = getNextPrescription({
            state: {
              weight: item.actualWeight,
              reps: item.actualReps,
              repMin: exercise.repMin,
              repMax: exercise.repMax,
              increment: exercise.increment,
              topRangeCount: 0,
            },
            difficulty,
            completedPlannedWork: item.completedSets >= item.plannedSets,
            painReported: pain.reported,
          });
          const items = session.items.map((entry, itemIndex) => {
            if (entry.id === itemId) {
              return {
                ...entry,
                status: 'completed' as const,
                difficulty,
                painReported: pain.reported,
                painLocation: pain.location,
                painSeverity: pain.severity,
              };
            }
            if (itemIndex === index + 1 && entry.status === 'pending') return { ...entry, status: 'active' as const };
            return entry;
          });
          const isLast = index >= items.length - 1;
          const updated = isLast
            ? markSessionComplete({ ...session, items, currentItemIndex: index })
            : { ...session, items, currentItemIndex: index + 1, restEndAt: undefined };
          const nextEquipment = { ...state.equipment, [exercise.equipmentId]: 'present' as const };
          return {
            activeSession: updated,
            completedSessions: isLast
              ? [updated, ...state.completedSessions.filter((completed) => completed.id !== updated.id)].slice(0, 20)
              : state.completedSessions,
            equipment: nextEquipment,
            nextPrescriptions: {
              ...state.nextPrescriptions,
              [exercise.id]: { weight: progression.weight, reps: progression.reps, reason: progression.reason },
            },
          };
        }),
      setUnavailableReason: (itemId, reason) =>
        set((state) => {
          const session = state.activeSession;
          if (!session) return state;
          const item = session.items.find((entry) => entry.id === itemId);
          const exercise = item ? exerciseById[item.exerciseId] : undefined;
          if (!item || !exercise) return state;
          const busyEquipmentIds =
            reason === 'busy' && !session.busyEquipmentIds.includes(exercise.equipmentId)
              ? [...session.busyEquipmentIds, exercise.equipmentId]
              : session.busyEquipmentIds;
          const equipment =
            reason === 'absent' ? { ...state.equipment, [exercise.equipmentId]: 'absent' as const } : state.equipment;
          return { activeSession: { ...session, busyEquipmentIds }, equipment };
        }),
      replaceExercise: (itemId, exerciseId, reason) =>
        set((state) => {
          const session = state.activeSession;
          const replacement = exerciseById[exerciseId];
          if (!session || !replacement) return state;
          return {
            activeSession: {
              ...session,
              restEndAt: undefined,
              items: session.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      originalExerciseId: item.originalExerciseId ?? item.exerciseId,
                      exerciseId,
                      replacementReason: reason,
                      plannedWeight: replacement.weight,
                      actualWeight: replacement.weight,
                      plannedReps: replacement.reps,
                      actualReps: replacement.reps,
                      plannedSets: replacement.sets,
                      completedSets: 0,
                    }
                  : item,
              ),
            },
          };
        }),
      skipExercise: (itemId) =>
        set((state) => {
          const session = state.activeSession;
          if (!session) return state;
          const index = session.items.findIndex((item) => item.id === itemId);
          if (index < 0) return state;
          const items = session.items.map((item, itemIndex) => {
            if (item.id === itemId) return { ...item, status: 'skipped' as const, replacementReason: 'skip' as const };
            if (itemIndex === index + 1) return { ...item, status: 'active' as const };
            return item;
          });
          const isLast = index >= items.length - 1;
          const updated = isLast
            ? markSessionComplete({ ...session, items, currentItemIndex: index })
            : { ...session, items, currentItemIndex: index + 1 };
          return {
            activeSession: updated,
            completedSessions: isLast ? [updated, ...state.completedSessions] : state.completedSessions,
          };
        }),
      pauseWorkout: () => set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, status: 'paused' } : null })),
      resumeWorkout: () => set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, status: 'active' } : null })),
      discardWorkout: () => set({ activeSession: null }),
      clearRest: () => set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, restEndAt: undefined } : null })),
      extendRest: (seconds) =>
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, restEndAt: (state.activeSession.restEndAt ?? Date.now()) + seconds * 1000 }
            : null,
        })),
      returnHome: () => set({ activeSession: null }),
      logProtein: () =>
        set((state) => {
          const localDate = localDateKey();
          if (state.proteinLogs.some((log) => log.localDate === localDate)) return state;
          return {
            proteinLogs: [
              ...state.proteinLogs,
              { localDate, completedAt: new Date().toISOString(), grams: state.profile.proteinGrams },
            ].slice(-60),
          };
        }),
      resetAll: () =>
        set({
          onboardingCompleted: false,
          profile: defaultProfile,
          activeSession: null,
          completedSessions: [],
          equipment: {},
          proteinLogs: [],
          nextPrescriptions: {},
        }),
    }),
    {
      name: 'nxtset-state-v1',
      version: 1,
      storage: createJSONStorage(() => appStorage),
      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
        profile: state.profile,
        activeSession: state.activeSession,
        completedSessions: state.completedSessions,
        equipment: state.equipment,
        proteinLogs: state.proteinLogs,
        nextPrescriptions: state.nextPrescriptions,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

