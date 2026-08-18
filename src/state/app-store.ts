import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { exerciseById } from '@/content';
import { xpForCompletedWorkout } from '@/domain/momentum';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { getNextPrescription } from '@/domain/progression';
import { buildWorkoutItems, selectPersonalizedProgram } from '@/domain/workout';
import { appStorage } from '@/data/storage';
import type {
  Difficulty,
  EquipmentStatus,
  ProteinLog,
  SleepBand,
  SorenessLevel,
  UnavailableReason,
  UserProfile,
  WorkoutSession,
  XpEvent,
} from '@/types';
import { localDateKey } from '@/utils/units';

type NextPrescription = { weight: number | null; reps: number; reason: string; topRangeCount: number };

type AppState = {
  hydrated: boolean;
  onboardingCompleted: boolean;
  scienceProfilePending: boolean;
  profile: UserProfile;
  activeSession: WorkoutSession | null;
  completedSessions: WorkoutSession[];
  equipment: Record<string, EquipmentStatus>;
  proteinLogs: ProteinLog[];
  xpEvents: XpEvent[];
  nextPrescriptions: Record<string, NextPrescription>;
  setHydrated: (value: boolean) => void;
  updateProfile: (values: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  completeScienceProfile: () => void;
  startWorkout: () => WorkoutSession;
  setRecoveryCheck: (sleep: SleepBand, soreness: SorenessLevel, acceptAdjustment: boolean) => void;
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
  logProtein: (grams?: number) => void;
  resetAll: () => void;
};

const defaultProfile: UserProfile = {
  goal: 'lean_athletic',
  focusMuscle: 'shoulders',
  experience: 'first',
  weeklyFrequency: 3,
  sessionDuration: 45,
  gymName: 'Demo Gym',
  bodyWeightKg: null,
  heightCm: null,
  proteinMealCoverage: 'unknown',
  nutritionSafetyStatus: 'standard',
  proteinMode: 'daily',
  proteinGrams: 25,
  proteinTiming: 'post_workout',
};

function markSessionComplete(session: WorkoutSession): WorkoutSession {
  return { ...session, status: 'completed', completedAt: new Date().toISOString(), restEndAt: undefined };
}

function appendXpEvent(events: XpEvent[], event: Omit<XpEvent, 'id' | 'createdAt'>): XpEvent[] {
  if (events.some((entry) => entry.sourceId === event.sourceId)) return events;
  const createdAt = new Date().toISOString();
  return [...events, { ...event, id: `${event.sourceId}-${Date.now()}`, createdAt }].slice(-240);
}

function workoutXp(session: WorkoutSession): number {
  const planned = session.items.reduce((sum, item) => sum + item.plannedSets, 0);
  const completed = session.items.reduce((sum, item) => sum + item.completedSets, 0);
  return xpForCompletedWorkout(completed, planned);
}

function normalizeSession(session: WorkoutSession): WorkoutSession {
  return {
    ...session,
    items: session.items.map((item) => ({ ...item, setLogs: item.setLogs ?? [] })),
  };
}

function persistenceReplacer(_key: string, value: unknown) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return undefined;
  }
  return value;
}

const persistedStorage = createJSONStorage(() => appStorage, { replacer: persistenceReplacer });

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboardingCompleted: false,
      scienceProfilePending: false,
      profile: defaultProfile,
      activeSession: null,
      completedSessions: [],
      equipment: {},
      proteinLogs: [],
      xpEvents: [],
      nextPrescriptions: {},
      setHydrated: (value) => set({ hydrated: value }),
      updateProfile: (values) => set((state) => ({ profile: { ...state.profile, ...values } })),
      completeOnboarding: () => set({ onboardingCompleted: true, scienceProfilePending: false }),
      completeScienceProfile: () => set({ scienceProfilePending: false }),
      startWorkout: () => {
        const current = get().activeSession;
        if (current && current.status !== 'completed') {
          const resumed = { ...current, status: 'active' as const };
          set({ activeSession: resumed });
          return resumed;
        }
        const { profile, completedSessions, nextPrescriptions } = get();
        const program = selectPersonalizedProgram(profile, completedSessions.length);
        const items = buildWorkoutItems(program).map((item) => {
          const next = nextPrescriptions[item.exerciseId];
          return next
            ? {
                ...item,
                plannedWeight: next.weight,
                actualWeight: next.weight,
                plannedReps: next.reps,
                actualReps: next.reps,
              }
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
      setRecoveryCheck: (sleep, soreness, acceptAdjustment) =>
        set((state) => {
          const session = state.activeSession;
          if (!session) return state;
          const shouldSuggestAdjustment = sleep === 'under_6' || soreness === 'high';
          const adjusted = shouldSuggestAdjustment && acceptAdjustment;
          const localDate = localDateKey();
          const items = adjusted
            ? session.items.map((item) => ({ ...item, plannedSets: Math.max(1, item.plannedSets - 1) }))
            : session.items;
          return {
            activeSession: {
              ...session,
              items,
              recoveryCheck: { localDate, sleep, soreness, adjustmentAccepted: adjusted },
            },
            xpEvents: appendXpEvent(state.xpEvents, {
              localDate,
              type: 'recovery_check',
              xp: 10,
              sourceId: `recovery-${localDate}`,
            }),
          };
        }),
      completeSet: (itemId) =>
        set((state) => {
          if (!state.activeSession) return state;
          const item = state.activeSession.items.find((entry) => entry.id === itemId);
          if (!item || item.completedSets >= item.plannedSets) return state;
          const completedSets = item.completedSets + 1;
          const completedAt = new Date().toISOString();
          const items = state.activeSession.items.map((entry) =>
            entry.id === itemId
              ? {
                  ...entry,
                  completedSets,
                  status: 'active' as const,
                  setLogs: [
                    ...entry.setLogs,
                    {
                      id: `${itemId}-set-${completedSets}-${Date.now()}`,
                      completedAt,
                      weight: entry.actualWeight,
                      reps: entry.actualReps,
                    },
                  ],
                }
              : entry,
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
          const previous = state.nextPrescriptions[exercise.id];
          const progression = getNextPrescription({
            state: {
              weight: item.actualWeight,
              reps: item.actualReps,
              repMin: exercise.repMin,
              repMax: exercise.repMax,
              increment: exercise.increment,
              topRangeCount: previous?.topRangeCount ?? 0,
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
              ? [updated, ...state.completedSessions.filter((completed) => completed.id !== updated.id)].slice(0, 40)
              : state.completedSessions,
            equipment: nextEquipment,
            xpEvents: isLast
              ? appendXpEvent(state.xpEvents, {
                  localDate: localDateKey(new Date(updated.completedAt!)),
                  type: 'workout',
                  xp: workoutXp(updated),
                  sourceId: `workout-${updated.id}`,
                })
              : state.xpEvents,
            nextPrescriptions: {
              ...state.nextPrescriptions,
              [exercise.id]: {
                weight: progression.weight,
                reps: progression.reps,
                reason: progression.reason,
                topRangeCount: progression.topRangeCount,
              },
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
                      setLogs: [],
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
            completedSessions: isLast
              ? [updated, ...state.completedSessions.filter((completed) => completed.id !== updated.id)].slice(0, 40)
              : state.completedSessions,
            xpEvents: isLast
              ? appendXpEvent(state.xpEvents, {
                  localDate: localDateKey(new Date(updated.completedAt!)),
                  type: 'workout',
                  xp: workoutXp(updated),
                  sourceId: `workout-${updated.id}`,
                })
              : state.xpEvents,
          };
        }),
      pauseWorkout: () =>
        set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, status: 'paused' } : null })),
      resumeWorkout: () =>
        set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, status: 'active' } : null })),
      discardWorkout: () => set({ activeSession: null }),
      clearRest: () =>
        set((state) => ({ activeSession: state.activeSession ? { ...state.activeSession, restEndAt: undefined } : null })),
      extendRest: (seconds) =>
        set((state) => ({
          activeSession: state.activeSession
            ? { ...state.activeSession, restEndAt: (state.activeSession.restEndAt ?? Date.now()) + seconds * 1000 }
            : null,
        })),
      returnHome: () => set({ activeSession: null }),
      logProtein: (grams) =>
        set((state) => {
          const localDate = localDateKey();
          const plan = calculateProteinPlan(state.profile);
          const todaysLogs = state.proteinLogs.filter((log) => log.localDate === localDate);
          if (plan.scheduledServings <= todaysLogs.length) return state;
          const nextLogs = [
            ...state.proteinLogs,
            {
              id: `protein-${Date.now()}-${todaysLogs.length + 1}`,
              localDate,
              completedAt: new Date().toISOString(),
              grams: typeof grams === 'number' && Number.isFinite(grams) ? grams : plan.servingGrams,
            },
          ].slice(-180);
          const completedPlan = todaysLogs.length + 1 >= plan.scheduledServings;
          return {
            proteinLogs: nextLogs,
            xpEvents: completedPlan
              ? appendXpEvent(state.xpEvents, {
                  localDate,
                  type: 'protein_plan',
                  xp: 20,
                  sourceId: `protein-${localDate}`,
                })
              : state.xpEvents,
          };
        }),
      resetAll: () =>
        set({
          onboardingCompleted: false,
          scienceProfilePending: false,
          profile: defaultProfile,
          activeSession: null,
          completedSessions: [],
          equipment: {},
          proteinLogs: [],
          xpEvents: [],
          nextPrescriptions: {},
        }),
    }),
    {
      name: 'nxtset-state-v1',
      version: 2,
      storage: persistedStorage,
      migrate: (persistedState, version) => {
        const state = (persistedState ?? {}) as Partial<AppState>;
        const profile = { ...defaultProfile, ...(state.profile ?? {}) };
        const migratedFromLegacy = version < 2;
        return {
          ...state,
          profile,
          scienceProfilePending: migratedFromLegacy && Boolean(state.onboardingCompleted),
          activeSession: state.activeSession ? normalizeSession(state.activeSession) : null,
          completedSessions: (state.completedSessions ?? []).map(normalizeSession),
          proteinLogs: (state.proteinLogs ?? []).map((log, index) => ({
            ...log,
            id: log.id ?? `protein-migrated-${index}-${log.completedAt}`,
          })),
          xpEvents: state.xpEvents ?? [],
          nextPrescriptions: Object.fromEntries(
            Object.entries(state.nextPrescriptions ?? {}).map(([id, next]) => [id, { ...next, topRangeCount: next.topRangeCount ?? 0 }]),
          ),
        } as AppState;
      },
      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
        scienceProfilePending: state.scienceProfilePending,
        profile: state.profile,
        activeSession: state.activeSession,
        completedSessions: state.completedSessions,
        equipment: state.equipment,
        proteinLogs: state.proteinLogs,
        xpEvents: state.xpEvents,
        nextPrescriptions: state.nextPrescriptions,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
