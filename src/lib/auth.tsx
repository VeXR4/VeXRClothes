import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ ok: boolean; message: string }>;
  signInWithPhone: (phone: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const MOCK_USER_KEY = 'vexr-mock-user';

function getMockUser(): User | null {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setMockUser(user: User | null) {
  if (user) localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(MOCK_USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const mockUser = getMockUser();
      if (mockUser) {
        setUser(mockUser);
        setSession({ user: mockUser } as Session);
      }
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithEmail: AuthState['signInWithEmail'] = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      const mockUser = {
        id: 'mock-' + btoa(email).slice(0, 12),
        aud: 'authenticated',
        role: 'authenticated',
        email,
        app_metadata: {},
        user_metadata: { full_name: 'کاربر آزمایشی' },
        created_at: new Date().toISOString(),
      } as User;
      setMockUser(mockUser);
      setUser(mockUser);
      setSession({ user: mockUser } as Session);
      return { ok: true, message: 'ورود موفق بود (حالت آزمایشی).' };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, message: 'ایمیل یا رمز عبور اشتباه است.' };
    return { ok: true, message: 'ورود موفق بود.' };
  };

  const signUpWithEmail: AuthState['signUpWithEmail'] = async (email, password, fullName) => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: true, message: 'ثبت‌نام در حالت آزمایشی فعال نیست. مستقیم وارد شوید.' };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { ok: false, message: error.message };
    if (!data.session) {
      return { ok: true, message: 'ثبت‌نام انجام شد. اکنون وارد شوید.' };
    }
    return { ok: true, message: 'ثبت‌نام موفق بود.' };
  };

  const signInWithPhone: AuthState['signInWithPhone'] = async (phone) => {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, message: 'ورود با شماره در حالت آزمایشی فعال نیست.' };
    }
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'کد تایید ارسال شد.' };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setMockUser(null);
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
    setSession(null);
  };

  const value: AuthState = {
    session,
    user: session?.user ?? user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
