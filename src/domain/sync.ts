import type { SyncEvent } from '@/types';

export function dedupeSyncEvents(events: SyncEvent[]): SyncEvent[] {
  const seen = new Set<string>();
  return events.filter((event) => {
    if (seen.has(event.clientEventId)) return false;
    seen.add(event.clientEventId);
    return true;
  });
}

