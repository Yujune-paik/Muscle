import type { ExerciseMediaSpec } from '@/types';

const imageRoot = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';
const sourceUrl = 'https://github.com/yuhonas/free-exercise-db';

const youtube = (
  videoId: string,
  title: string,
): NonNullable<ExerciseMediaSpec['youtube']> => ({
  videoId,
  title,
  channel: 'PureGym',
  reviewedAt: '2026-08-18',
});

const media = (
  assetId: string,
  video?: NonNullable<ExerciseMediaSpec['youtube']>,
): ExerciseMediaSpec => ({
  posePair: {
    startUri: `${imageRoot}/${assetId}/0.jpg`,
    endUri: `${imageRoot}/${assetId}/1.jpg`,
    sourceName: 'free-exercise-db',
    sourceUrl,
    license: 'Unlicense',
  },
  youtube: video,
});

export const exerciseMediaById: Record<string, ExerciseMediaSpec> = {
  chest_press: media('Leverage_Chest_Press', youtube('sqNwDkUU_Ps', 'How To Use The Chest Press Machine')),
  dumbbell_press: media('Dumbbell_Bench_Press', youtube('AduT4Eq-iP0', 'How To Do A Dumbbell Bench Press')),
  push_up: media('Pushups', youtube('Env8gAr_QnE', 'How To Do Press Ups')),
  incline_press: media('Leverage_Incline_Chest_Press', youtube('oZVCBM9f8Eo', 'How To Do A Dumbbell Incline Press')),
  pec_fly: media('Butterfly', youtube('eGjt4lk6g34', 'How To Use The Chest Fly Machine')),
  lat_pulldown: media('Wide-Grip_Lat_Pulldown', youtube('JGeRYIZdojU', 'How To Do A Lat Pulldown')),
  cable_pulldown: media('Full_Range-Of-Motion_Lat_Pulldown', youtube('JGeRYIZdojU', 'How To Do A Lat Pulldown')),
  assisted_pullup: media('Pullups', youtube('wFj808u2HWU', 'How To Use The Assisted Pull Up Machine')),
  leg_press: media('Leg_Press', youtube('p5dCqF7wWUw', 'How To Use The Leg Press Machine')),
  goblet_squat: media('Goblet_Squat', youtube('zBV3ceGyAxw', 'How To Do A Goblet Squat')),
  bodyweight_squat: media('Bodyweight_Squat', youtube('l83R5PblSMA', 'How To Bodyweight Squat')),
  leg_extension: media('Leg_Extensions', youtube('4ZDm5EbiFI8', 'How To Do A Leg Extension')),
  leg_curl: media('Seated_Leg_Curl'),
  seated_row: media('Seated_Cable_Rows', youtube('lJoozxC0Rns', 'How To Do A Seated Cable Row')),
  cable_row: media('Seated_Cable_Rows', youtube('lJoozxC0Rns', 'How To Do A Seated Cable Row')),
  one_arm_row: media('One-Arm_Dumbbell_Row', youtube('ZRSGpBUVcNw', 'How To Do Single Arm Dumbbell Rows')),
  lateral_raise_machine: media('Seated_Side_Lateral_Raise'),
  dumbbell_lateral_raise: media('Side_Lateral_Raise'),
  cable_lateral_raise: media('Cable_Seated_Lateral_Raise'),
  shoulder_press: media('Leverage_Shoulder_Press', youtube('GcY6TZxfS0k', 'How To Use The Shoulder Press Machine')),
  reverse_fly: media('Reverse_Flyes', youtube('nlkF7_2O_Lw', 'How To Do A Rear Delt Fly')),
};
