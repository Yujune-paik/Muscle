import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { appStorage } from '@/data/storage';

const mode = process.env.EXPO_PUBLIC_APP_MODE ?? 'demo';
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const authStorage = {
  getItem: async (key: string) => Promise.resolve(appStorage.getItem(key)),
  setItem: async (key: string, value: string) => {
    await Promise.resolve(appStorage.setItem(key, value));
  },
  removeItem: async (key: string) => {
    await Promise.resolve(appStorage.removeItem(key));
  },
};

export const supabase: SupabaseClient | null =
  mode === 'cloud' && url && publishableKey
    ? createClient(url, publishableKey, {
        auth: { storage: authStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null;

export const isCloudMode = Boolean(supabase);

export async function ensureCloudSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const result = await supabase.auth.signInAnonymously();
  if (result.error) throw result.error;
  return result.data.session;
}

export async function sendMagicLink(email: string, redirectTo?: string) {
  if (!supabase) throw new Error('クラウドモードが設定されていません。');
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: redirectTo } });
  if (error) throw error;
}

export async function deleteCloudAccount() {
  if (!supabase) return;
  const { error } = await supabase.rpc('delete_my_account');
  if (error) throw error;
  await supabase.auth.signOut();
}
