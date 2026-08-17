import { Platform } from 'react-native';

export async function tapHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  const Haptics = await import('expo-haptics');
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function completionHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  const Haptics = await import('expo-haptics');
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

