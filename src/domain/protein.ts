export type ProteinTiming = 'post_workout' | 'morning' | 'evening';

export function proteinReminderAt(base: Date, timing: ProteinTiming): Date {
  const reminder = new Date(base);
  if (timing === 'post_workout') reminder.setMinutes(reminder.getMinutes() + 20);
  if (timing === 'morning') reminder.setHours(8, 0, 0, 0);
  if (timing === 'evening') reminder.setHours(21, 0, 0, 0);
  if (reminder.getTime() <= base.getTime()) reminder.setDate(reminder.getDate() + 1);
  return reminder;
}

