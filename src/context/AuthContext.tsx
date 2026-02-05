import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function normalizeUsernameForLogin(username: string) {
  return username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function emailFromUsername(username: string) {
  const normalized = normalizeUsernameForLogin(username);
  return `${normalized}@minecrate.local`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username: string, password: string): Promise<{ error: string | null }> => {
    try {
      const trimmedUsername = username.trim();
      const normalized = normalizeUsernameForLogin(trimmedUsername);

      if (!normalized) {
        return { error: 'Username must contain at least one letter or number' };
      }

      // Check if username already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (existingProfile) {
        return { error: 'Username already taken' };
      }

      // Create a fake email from username (for backend auth)
      const fakeEmail = emailFromUsername(trimmedUsername);

      // Fetch country from IP
      let country: string | null = null;
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          country = geoData.country_name || geoData.country || null;
        }
      } catch {
        // ignore
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: {
          data: { username: trimmedUsername, country },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          return { error: 'Username already taken' };
        }
        return { error: error.message };
      }

      // Update profile with country if signup succeeded (may require an active session)
      if (authData.user && country) {
        await supabase
          .from('profiles')
          .update({ country })
          .eq('user_id', authData.user.id);
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (username: string, password: string): Promise<{ error: string | null }> => {
    try {
      const trimmedUsername = username.trim();
      const normalized = normalizeUsernameForLogin(trimmedUsername);

      if (!normalized) {
        return { error: 'Username must contain at least one letter or number' };
      }

      // Create the fake email from username
      const fakeEmail = emailFromUsername(trimmedUsername);

      const { error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      });

      if (error) {
        const msg = error.message?.toLowerCase?.() ?? '';
        if (msg.includes('invalid login credentials')) {
          return { error: 'Invalid username or password' };
        }
        // Surface other errors (rate limit, email confirmation, etc.) instead of hiding them.
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
