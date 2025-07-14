import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'slim-minder-web@1.0.0'
    }
  }
});

// Auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  userData: {
    full_name: string;
    date_of_birth: string;
    account_tier: 'FREE' | 'CORE' | 'PREMIUM';
  }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const getSession = () => {
  return supabase.auth.getSession();
};

// Real-time subscription helpers
export const subscribeToUserData = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('user_data_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'user_profiles',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
};

export const subscribeToTransactions = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('transaction_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'transactions',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe();
}; 