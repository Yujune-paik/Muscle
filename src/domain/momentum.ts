import type { WorkoutSession, XpEvent } from '@/types';

const XP_PER_LEVEL = 500;

function mondayKey(date: Date): string {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  const y = copy.getFullYear();
  const m = `${copy.getMonth() + 1}`.padStart(2, '0');
  const d = `${copy.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addWeeks(key: string, amount: number): string {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + amount * 7);
  return mondayKey(date);
}

export type MomentumSummary = {
  totalXp: number;
  level: number;
  levelXp: number;
  nextLevelXp: number;
  chainWeeks: number;
  recoveryWeeks: number;
  thisWeekWorkouts: number;
};

export function calculateMomentum(
  events: XpEvent[],
  sessions: WorkoutSession[],
  weeklyTarget: number,
  now = new Date(),
): MomentumSummary {
  const totalXp = events.reduce((sum, event) => sum + event.xp, 0);
  const counts = new Map<string, number>();
  sessions.forEach((session) => {
    if (!session.completedAt) return;
    const key = mondayKey(new Date(session.completedAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const currentKey = mondayKey(now);
  const thisWeekWorkouts = counts.get(currentKey) ?? 0;
  let cursor = thisWeekWorkouts >= weeklyTarget ? currentKey : addWeeks(currentKey, -1);
  let chainWeeks = 0;
  while ((counts.get(cursor) ?? 0) >= weeklyTarget) {
    chainWeeks += 1;
    cursor = addWeeks(cursor, -1);
  }

  return {
    totalXp,
    level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
    levelXp: totalXp % XP_PER_LEVEL,
    nextLevelXp: XP_PER_LEVEL,
    chainWeeks,
    recoveryWeeks: Math.floor(chainWeeks / 4),
    thisWeekWorkouts,
  };
}

export function xpForCompletedWorkout(completedSets: number, plannedSets: number): number {
  if (plannedSets <= 0) return 0;
  return Math.round(100 * Math.min(1, completedSets / plannedSets));
}
