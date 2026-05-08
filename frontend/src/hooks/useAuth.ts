import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionUser: any) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role, patient_id, doctor_id')
      .eq('id', sessionUser.id)
      .single();

    if (!error && profile) {
      setUser({ ...sessionUser, ...profile });
    } else {
      setUser(sessionUser);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        localStorage.setItem('token', session.access_token);
        await fetchProfile(session.user);
      }
      
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        localStorage.setItem('token', session.access_token);
        await fetchProfile(session.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: any) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email, // Using email instead of username
      password: credentials.password
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, login, logout };
};
