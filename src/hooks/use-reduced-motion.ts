import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';

let reducedMotion = false;
let nativeSubscription: { remove: () => void } | null = null;
const listeners = new Set<() => void>();

function publish(value: boolean) {
  if (reducedMotion === value) return;
  reducedMotion = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!nativeSubscription) {
    AccessibilityInfo.isReduceMotionEnabled().then(publish).catch(() => publish(false));
    nativeSubscription = AccessibilityInfo.addEventListener('reduceMotionChanged', publish);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      nativeSubscription?.remove();
      nativeSubscription = null;
    }
  };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => reducedMotion, () => false);
}
