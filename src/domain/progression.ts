import type { Difficulty, ProgressionState } from '@/types';

export type ProgressionInput = {
  state: ProgressionState;
  difficulty: Difficulty;
  completedPlannedWork: boolean;
  painReported: boolean;
};

export type ProgressionResult = ProgressionState & { reason: string };

export function getNextPrescription(input: ProgressionInput): ProgressionResult {
  const { state, difficulty, completedPlannedWork, painReported } = input;

  if (painReported) {
    return { ...state, reason: '痛みの記録があるため、負荷は上げず別の種目も検討します。' };
  }

  if (difficulty === 'hard') {
    if (!completedPlannedWork && state.reps > state.repMin) {
      return { ...state, reps: state.reps - 1, topRangeCount: 0, reason: '前回はきつかったので、次は1回だけ減らします。' };
    }
    return { ...state, topRangeCount: 0, reason: '前回はきつかったので、同じ負荷でもう一度行います。' };
  }

  const shouldIncreaseWeight =
    completedPlannedWork && state.reps >= state.repMax && (difficulty === 'easy' || state.topRangeCount >= 1);

  if (shouldIncreaseWeight && state.weight !== null && state.increment !== null) {
    return {
      ...state,
      weight: state.weight + state.increment,
      reps: state.repMin,
      topRangeCount: 0,
      reason: '上限まで安定してできたので、次は重さを1段階上げます。',
    };
  }

  if (completedPlannedWork && state.reps < state.repMax) {
    return {
      ...state,
      reps: state.reps + 1,
      topRangeCount: state.reps + 1 === state.repMax ? state.topRangeCount + 1 : 0,
      reason: difficulty === 'easy' ? '前回余裕があったので、次は1回だけ増やします。' : '前回できたので、次は1回だけ増やします。',
    };
  }

  return { ...state, reason: '前回の内容を保って、同じ負荷でもう一度行います。' };
}

