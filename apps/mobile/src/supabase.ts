import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// 🔧 VERVANG DIT DOOR JE ECHTE SUPABASE CREDENTIALS
// Ga naar je Supabase project dashboard → Settings → API
// Kopieer de Project URL en anon public key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// ⚠️  ZET JE ECHTE CREDENTIALS HIER IN VOOR TESTING
// const supabaseUrl = 'https://jouw-project-id.supabase.co';
// const supabaseAnon = 'jouw-anon-key-hier';

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: AsyncStorage as any,
    detectSessionInUrl: false,
  },
});

export async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch {
    return null;
  }
}

