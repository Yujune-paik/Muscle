import { beforeEach, describe, expect, it } from 'vitest';

import { appStorage } from '@/data/storage';
import { exerciseMediaById } from '@/content/exercise-media';
import { exercises } from '@/content';
import { proteinReminderAt } from '@/domain/protein';
import { calculateProteinPlan } from '@/domain/protein-plan';
import { calculateMomentum } from '@/domain/momentum';
import { getNextPrescription } from '@/domain/progression';
import { rankReplacements } from '@/domain/replacement';
import { calculateMuscleStimulus } from '@/domain/stimulus';
import { dedupeSyncEvents } from '@/domain/sync';
import { buildWorkoutItems, copyPlannedToActual, selectPersonalizedProgram, selectProgram, updateEquipmentStatus } from '@/domain/workout';
import type { SyncEvent, UserProfile, WorkoutSession, XpEvent } from '@/types';
import { kgToLb, lbToKg } from '@/utils/units';

describe('progression', () => {
  const state = { weight: 25, reps: 10, repMin: 8, repMax: 12, increment: 5, topRangeCount: 0 };

  it('changes only reps after a good completed exposure', () => {
    expect(getNextPrescription({ state, difficulty: 'good', completedPlannedWork: true, painReported: false })).toMatchObject({ weight: 25, reps: 11 });
  });

  it('increases weight and resets reps after repeated top-range success', () => {
    const result = getNextPrescription({ state: { ...state, reps: 12, topRangeCount: 1 }, difficulty: 'good', completedPlannedWork: true, painReported: false });
    expect(result).toMatchObject({ weight: 30, reps: 8 });
  });

  it('never increases after pain', () => {
    const result = getNextPrescription({ state, difficulty: 'easy', completedPlannedWork: true, painReported: true });
    expect(result.weight).toBe(25);
    expect(result.reps).toBe(10);
  });
});

describe('replacement ranking', () => {
  it('returns at most two valid candidates and prefers known equipment', () => {
    const ranked = rankReplacements('chest_press', { dumbbells_bench: 'present', bodyweight: 'unknown' });
    expect(ranked).toHaveLength(2);
    expect(ranked[0]?.exercise.id).toBe('dumbbell_press');
  });

  it('removes absent equipment', () => {
    const ranked = rankReplacements('chest_press', { dumbbells_bench: 'absent' });
    expect(ranked.map((entry) => entry.exercise.id)).toEqual(['push_up']);
  });
});

describe('program and records', () => {
  it('keeps two-day users on A/B', () => {
    expect(selectProgram(2, 2).name).toBe('Full Body A');
  });

  it('copies planned values into actual values', () => {
    const item = buildWorkoutItems(selectProgram(3, 0))[0]!;
    expect(copyPlannedToActual({ ...item, actualWeight: null, actualReps: 0 })).toMatchObject({ actualWeight: item.plannedWeight, actualReps: item.plannedReps });
  });

  it('persists absence but treats busy as session-only', () => {
    expect(updateEquipmentStatus('unknown', 'busy')).toBe('unknown');
    expect(updateEquipmentStatus('unknown', 'absent')).toBe('absent');
    expect(updateEquipmentStatus('unknown', 'completed')).toBe('present');
  });

  it('uses the physique goal, focus and duration to build a bounded program', () => {
    const profile: UserProfile = {
      goal: 'v_taper', focusMuscle: 'shoulders', experience: 'some', weeklyFrequency: 3,
      sessionDuration: 30, gymName: 'Demo Gym', bodyWeightKg: 65, heightCm: 170,
      proteinMealCoverage: 'medium', nutritionSafetyStatus: 'standard', proteinMode: 'daily',
      proteinGrams: 25, proteinTiming: 'post_workout',
    };
    const program = selectPersonalizedProgram(profile, 0);
    expect(program.name).toContain('V-Taper');
    expect(program.exerciseIds).toHaveLength(4);
    expect(program.exerciseIds).toContain('lateral_raise_machine');
  });
});

describe('science-based personalization', () => {
  const profile: UserProfile = {
    goal: 'lean_athletic', focusMuscle: 'chest', experience: 'first', weeklyFrequency: 3,
    sessionDuration: 45, gymName: 'Demo Gym', bodyWeightKg: 65, heightCm: 170,
    proteinMealCoverage: 'low', nutritionSafetyStatus: 'standard', proteinMode: 'daily',
    proteinGrams: 25, proteinTiming: 'post_workout',
  };

  it('separates the food-inclusive protein target from supplemental servings', () => {
    expect(calculateProteinPlan(profile)).toMatchObject({
      actionTargetGrams: 105,
      rangeMinGrams: 90,
      rangeMaxGrams: 130,
      servingGrams: 20,
      scheduledServings: 2,
      plannedSupplementGrams: 40,
    });
  });

  it('does not produce a personalized protein prescription for consult status', () => {
    expect(calculateProteinPlan({ ...profile, nutritionSafetyStatus: 'consult' })).toMatchObject({ personalized: false, actionTargetGrams: null });
  });

  it('turns completed sets into muscle-specific relative stimulus', () => {
    const session: WorkoutSession = {
      id: 'session-science', title: 'Test', status: 'completed', currentItemIndex: 0,
      startedAt: '2026-08-18T01:00:00Z', completedAt: '2026-08-18T01:30:00Z', busyEquipmentIds: [], estimatedMinutes: 30,
      items: [{
        id: 'item-0', exerciseId: 'chest_press', status: 'completed', plannedWeight: 25, plannedReps: 10,
        plannedSets: 3, completedSets: 3, actualWeight: 25, actualReps: 10, difficulty: 'hard', painReported: false,
        setLogs: [1, 2, 3].map((set) => ({ id: `set-${set}`, completedAt: '2026-08-18T01:10:00Z', weight: 25, reps: 10 })),
      }],
    };
    const stimulus = calculateMuscleStimulus(session, [], profile);
    expect(stimulus.chest.score).toBeGreaterThan(stimulus.triceps.score);
    expect(stimulus.triceps.score).toBeGreaterThan(0);
    expect(stimulus.calves.score).toBe(0);
  });

  it('counts weekly consistency and XP without a daily streak penalty', () => {
    const sessions = ['2026-08-17T10:00:00Z', '2026-08-18T10:00:00Z'].map((completedAt, index) => ({
      id: `s-${index}`, title: 'Test', status: 'completed' as const, currentItemIndex: 0, items: [],
      startedAt: completedAt, completedAt, busyEquipmentIds: [], estimatedMinutes: 30,
    }));
    const events: XpEvent[] = [{ id: 'xp', localDate: '2026-08-18', createdAt: '2026-08-18T10:00:00Z', type: 'workout', xp: 120, sourceId: 'workout-s-1' }];
    expect(calculateMomentum(events, sessions, 2, new Date('2026-08-18T12:00:00Z'))).toMatchObject({ totalXp: 120, chainWeeks: 1, thisWeekWorkouts: 2 });
  });
});

describe('persistence adapter', () => {
  beforeEach(async () => { await appStorage.removeItem('test'); });
  it('round-trips a refresh-safe snapshot', async () => {
    const snapshot = JSON.stringify({ onboardingCompleted: true, completedSessions: [{ id: 'session-1' }] });
    await appStorage.setItem('test', snapshot);
    expect(await appStorage.getItem('test')).toBe(snapshot);
  });
});

describe('protein, sync, and units', () => {
  it('schedules post-workout reminder after completion', () => {
    const base = new Date('2026-08-18T10:00:00.000Z');
    expect(proteinReminderAt(base, 'post_workout').toISOString()).toBe('2026-08-18T10:20:00.000Z');
  });

  it('deduplicates client events idempotently', () => {
    const event: SyncEvent = { clientEventId: 'abc', createdAt: '2026-08-18T00:00:00Z', type: 'set', payload: {} };
    expect(dedupeSyncEvents([event, event])).toEqual([event]);
  });

  it('converts metric and imperial values predictably', () => {
    expect(kgToLb(10)).toBe(22);
    expect(lbToKg(22)).toBe(10);
  });
});

describe('exercise media manifest', () => {
  it('covers every exercise with an HTTPS start and end pose', () => {
    expect(Object.keys(exerciseMediaById).sort()).toEqual(exercises.map((exercise) => exercise.id).sort());
    for (const entry of Object.values(exerciseMediaById)) {
      expect(entry.posePair.startUri).toMatch(/^https:\/\//);
      expect(entry.posePair.endUri).toMatch(/^https:\/\//);
      expect(entry.posePair.license).toBe('Unlicense');
    }
  });

  it('keeps curated YouTube metadata explicit and reviewable', () => {
    const videos = Object.values(exerciseMediaById).flatMap((entry) => entry.youtube ? [entry.youtube] : []);
    expect(videos.length).toBeGreaterThanOrEqual(15);
    for (const video of videos) {
      expect(video.videoId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(video.channel).toBe('PureGym');
      expect(video.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
