'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type AuthContextType, type User } from '@/lib/supabase-types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Dynamically import createClient to ensure we're in browser context
        const { createClient } = await import('@/lib/supbase/client');

        let supabase;
        try {
          supabase = createClient();
        } catch (clientErr) {
          console.error('Supabase client initialization error:', clientErr);
          setError('Supabase environment variables not configured. Check .env.local');
          setIsLoading(false);
          return;
        }

        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
          }

          setUser(
            profile || {
              id: session.user.id,
              email: session.user.email || '',
              full_name: null,
              avatar_url: null,
              created_at: new Date().toISOString(),
            }
          );
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize auth');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const setupAuthListener = async () => {
      try {
        const { createClient } = await import('@/lib/supbase/client');
        let supabase;

        try {
          supabase = createClient();
        } catch (clientErr) {
          console.error('Supabase client error in listener:', clientErr);
          return;
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            // Fetch user profile on auth change
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Profile fetch error:', profileError);
            }

            setUser(
              profile || {
                id: session.user.id,
                email: session.user.email || '',
                full_name: null,
                avatar_url: null,
                created_at: new Date().toISOString(),
              }
            );
          } else {
            setUser(null);
          }
        });

        return () => {
          subscription?.unsubscribe();
        };
      } catch (err) {
        console.error('Error setting up auth listener:', err);
      }
    };

    const unsubscribe = setupAuthListener();
    return () => {
      unsubscribe?.then((unsub) => unsub?.());
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const { createClient } = await import('@/lib/supbase/client');
      const supabase = createClient();

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // The database trigger creates the profile row.
        // We keep the local auth state responsive and let the auth listener
        // re-hydrate the profile once Supabase finishes creating it.
        setUser({
          id: authData.user.id,
          email,
          full_name: fullName,
          avatar_url: null,
          created_at: new Date().toISOString(),
        });
      } else {
        // When email confirmation is enabled, Supabase may create the auth user
        // without immediately returning a session.
        setError('Account created. Check your email to confirm your account before signing in.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const { createClient } = await import('@/lib/supbase/client');
      const supabase = createClient();

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (authData.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }

        setUser(
          profile || {
            id: authData.user.id,
            email: authData.user.email || '',
            full_name: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
          }
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const { createClient } = await import('@/lib/supbase/client');
      const supabase = createClient();

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const { createClient } = await import('@/lib/supbase/client');
      const supabase = createClient();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

