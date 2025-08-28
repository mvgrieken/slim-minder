/**
 * Slim Minder - Supabase Service Configuration
 * 
 * This module handles the Supabase client setup and provides
 * utility functions for database operations.
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// Environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using mock data.');
}

// Supabase client configuration
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'x-client-info': 'slim-minder-mobile@0.1.0',
      },
    },
  }
);

// Type definitions for Supabase tables
export interface SupabaseUser {
  id: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category_id?: string;
  date: string;
  created_at: string;
}

export interface SupabaseBudget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'week' | 'month' | 'year';
  start_date: string;
  created_at: string;
}

export interface SupabaseGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  created_at: string;
}

// Utility functions
export const supabaseService = {
  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Sign in with email/password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign up with email/password
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(bucket: string, path: string, file: File | Blob) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    return data;
  },

  /**
   * Get signed URL for file
   */
  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) throw error;
    return data;
  },

  /**
   * Real-time subscription helper
   */
  subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    filter?: string
  ) {
    const subscription = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table,
          ...(filter && { filter })
        },
        callback
      )
      .subscribe();

    return subscription;
  },

  /**
   * Health check for Supabase connection
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (error && error.code !== 'PGRST116') { // Table doesn't exist is ok for setup
        throw error;
      }

      return { status: 'ok', message: 'Supabase connection successful' };
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return { 
        status: 'error', 
        message: `Supabase connection failed: ${error}` 
      };
    }
  }
};

// Auth event listeners
export const setupAuthListeners = (
  onAuthStateChange: (event: string, session: any) => void
) => {
  return supabase.auth.onAuthStateChange(onAuthStateChange);
};

export default supabase;