import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { sanitizeDisplayName } from '../lib/sanitize';

export type AuthResult = { error: string | null };
export type SignUpResult = AuthResult & { needsConfirmation?: boolean };

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Turn raw Supabase error strings into plain-English, user-facing copy. */
export function translateAuthError(message?: string | null): string {
  if (!message) return 'Something went wrong. Please try again.';
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Incorrect email or password.';
  if (m.includes('email not confirmed')) return 'Please confirm your email before signing in.';
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('already in use')) {
    return 'That email is already in use.';
  }
  if (m.includes('password should be at least') || m.includes('password is too short')) {
    return 'Password must be at least 8 characters.';
  }
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'Enter a valid email address.';
  if (m.includes('for security purposes') || m.includes('rate limit') || m.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (m.includes('network') || m.includes('failed to fetch')) {
    return 'Network error. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Restore a persisted session on launch.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    // Keep local state in sync with sign-in / sign-out / token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    signUp: async (email, password, displayName) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { display_name: sanitizeDisplayName(displayName) } },
      });
      if (error) return { error: translateAuthError(error.message) };
      // With confirmation on, Supabase returns a user with no identities for an
      // address that already exists (to avoid leaking which emails are registered).
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return { error: 'That email is already in use.' };
      }
      // No session means email confirmation is required before they can sign in.
      return { error: null, needsConfirmation: !data.session };
    },
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      return { error: error ? translateAuthError(error.message) : null };
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    resetPassword: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      return { error: error ? translateAuthError(error.message) : null };
    },
  }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
