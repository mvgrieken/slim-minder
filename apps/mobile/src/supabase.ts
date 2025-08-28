import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseAnon || 'anon', {
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

