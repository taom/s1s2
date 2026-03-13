/**
 * Supabase Client
 *
 * Server-side source of truth after sync.
 * Local-first architecture: all writes land in SQLite first,
 * then sync upstream via the sync queue.
 *
 * TODO: replace placeholder URL/key with real Supabase project credentials
 * stored in expo-secure-store.
 */

// import { createClient } from '@supabase/supabase-js';
// import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Placeholder — will be initialized when @supabase/supabase-js is installed
// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
//   auth: {
//     storage: {
//       getItem: (key: string) => SecureStore.getItemAsync(key),
//       setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
//       removeItem: (key: string) => SecureStore.deleteItemAsync(key),
//     },
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

export const supabase = null; // placeholder until deps installed

export { SUPABASE_URL, SUPABASE_ANON_KEY };
