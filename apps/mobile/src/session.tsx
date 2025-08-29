import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createGuest } from './api';
import { supabase } from './supabase';

type Session = { userId: string | null; loading: boolean; error?: string };
const SessionContext = createContext<Session>({ userId: null, loading: true });

export function useSession() {
  return useContext(SessionContext);
}

export const SessionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl === 'http://localhost') {
          console.warn('Supabase environment variables not configured, falling back to guest mode');
          setError('Supabase not configured - using guest mode');
        } else {
          // 1) Try Supabase session
          const { data } = await supabase.auth.getSession();
          const sub = data.session?.user?.id;
          if (sub) {
            if (!mounted) return;
            setUserId(sub);
            setLoading(false);
            return;
          }
        }
        
        // 2) Dev fallback: guest (if allowed)
        const allowGuest = (process.env.EXPO_PUBLIC_ALLOW_GUEST || 'true') === 'true';
        if (allowGuest) {
          const existing = await AsyncStorage.getItem('sm_user_id');
          if (existing) {
            if (!mounted) return;
            setUserId(existing);
            setLoading(false);
            return;
          }
          const guest = await createGuest();
          if (!mounted) return;
          await AsyncStorage.setItem('sm_user_id', guest.id);
          setUserId(guest.id);
        } else {
          setUserId(null);
        }
      } catch (e: any) {
        console.error('SessionProvider initialization error:', e);
        setError(String(e?.message || e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <SessionContext.Provider value={{ userId, loading, error }}>
      {children}
    </SessionContext.Provider>
  );
};
