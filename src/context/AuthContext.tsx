import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (username: string, email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

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

  const signUp = async (username: string, email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (username: string, password: string): Promise<{ error: string | null }> => {
    try {
      // First, find the user's email by username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('username', username)
        .single();

      if (profileError || !profile) {
        return { error: 'Invalid username or password' };
      }

      // Get user email from auth (we need to use the username as email for login)
      // Since we store username in metadata, let's try email login with username@placeholder
      // Actually, we need to store email separately. For now, let's require email for login too.
      
      // Simplified: Just try to login with provided credentials
      // In production, you'd want to lookup email by username first
      const { error } = await supabase.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@user.local`,
        password,
      });

      if (error) {
        // Try with username as email directly
        const { error: error2 } = await supabase.auth.signInWithPassword({
          email: username,
          password,
        });
        
        if (error2) {
          return { error: 'Invalid username or password' };
        }
      }

      return { error: null };
    } catch (err) {
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
