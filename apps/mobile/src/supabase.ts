import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://aenhydmyyneunvhunxjz.supabase.co';
const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlbmh5ZG15eW5ldW52aHVueGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTYyMjcsImV4cCI6MjA3MTg5MjIyN30.P1rtifcC3BzqZFNojeS96pThMSP2HYmUh2YX-9UfdhM';

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

