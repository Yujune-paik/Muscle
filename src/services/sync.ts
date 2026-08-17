import type { SyncEvent } from '@/types';
import { dedupeSyncEvents } from '@/domain/sync';
import { supabase } from '@/services/supabase';

export async function flushSyncQueue(events: SyncEvent[]): Promise<SyncEvent[]> {
  const queue = dedupeSyncEvents(events);
  if (!supabase || queue.length === 0) return queue;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return queue;
  const { error } = await supabase.from('sync_events').upsert(
    queue.map((event) => ({
      user_id: data.user!.id,
      client_event_id: event.clientEventId,
      event_type: event.type,
      payload: event.payload,
      created_at: event.createdAt,
    })),
    { onConflict: 'client_event_id' },
  );
  return error ? queue : [];
}

