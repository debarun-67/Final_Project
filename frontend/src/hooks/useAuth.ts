import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionUser: any) => {
    try {
      const profilePromise = supabase
        .from('profiles')
        .select('role, patient_id, doctor_id')
        .eq('id', sessionUser.id)
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      if (!error && profile) {
        setUser({ ...sessionUser, ...profile });
      } else {
        setUser(sessionUser);
      }
    } catch (err) {
      console.warn('Could not fetch profile, falling back to session user:', err);
      setUser(sessionUser);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Fast path: if there is absolutely no token in sessionStorage,
    // we don't need to wait for Supabase's network verification to show the login screen.
    const hasSession = Object.keys(sessionStorage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    
    if (!hasSession) {
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      try {
        if (session) {
          await fetchProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth State Change Error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    // Fallback failsafe just in case
    const fallback = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 1500);

    return () => {
      mounted = false;
      clearTimeout(fallback);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials: any) => {
    // Failsafe timeout to prevent infinite "Authenticating..."
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout: Authentication server did not respond')), 10000);
    });

    const loginPromise = supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

    if (error) throw error;
    
    // Forcefully fetch profile and update state in case onAuthStateChange is delayed
    if (data && data.user) {
      await fetchProfile(data.user);
    }

    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
    }
  };

  return { user, loading, login, logout };
};
