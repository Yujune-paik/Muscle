import { Platform } from 'react-native';

import { proteinReminderAt, type ProteinTiming } from '@/domain/protein';

export async function scheduleProteinReminder(timing: ProteinTiming): Promise<{ scheduled: boolean; reason?: string }> {
  if (Platform.OS === 'web') return { scheduled: false, reason: 'Webではアプリ内表示でお知らせします。' };
  const Notifications = await import('expo-notifications');
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return { scheduled: false, reason: '通知は許可されませんでした。' };
  const date = proteinReminderAt(new Date(), timing);
  await Notifications.scheduleNotificationAsync({
    content: { title: 'NXTSET', body: 'いつもの1杯を、忘れないうちに。' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
  return { scheduled: true };
}

