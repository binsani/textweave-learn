import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User as AppUser, UserRole } from '@/types';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialized: boolean;

  // Actions
  initialize: () => () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, firstName: string, lastName: string, role?: 'student' | 'instructor') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<AppUser>) => void;
}

async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  return (data?.role as UserRole) || 'student';
}

async function mapSupabaseUser(su: SupabaseUser): Promise<AppUser> {
  const role = await fetchUserRole(su.id);
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url, bio')
    .eq('id', su.id)
    .single();

  const firstName = profile?.first_name || '';
  const lastName = profile?.last_name || '';

  return {
    id: su.id,
    email: su.email || '',
    name: [firstName, lastName].filter(Boolean).join(' ') || su.email || '',
    firstName,
    lastName,
    role,
    avatar: profile?.avatar_url || undefined,
    bio: profile?.bio || undefined,
    createdAt: su.created_at,
  };
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  initialized: false,

  initialize: () => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid deadlock with Supabase client
          setTimeout(async () => {
            const appUser = await mapSupabaseUser(session.user);
            set({ user: appUser, session, isAuthenticated: true, isLoading: false, initialized: true });
          }, 0);
        } else {
          set({ user: null, session: null, isAuthenticated: false, isLoading: false, initialized: true });
        }
      }
    );

    // Then get the initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await mapSupabaseUser(session.user);
        set({ user: appUser, session, isAuthenticated: true, isLoading: false, initialized: true });
      } else {
        set({ isLoading: false, initialized: true });
      }
    });

    return () => subscription.unsubscribe();
  },

  login: async (email, password) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  signup: async (email, password, firstName, lastName, role = 'student') => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, role },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
    // If user wants instructor role, we need to add it after signup
    // The handle_new_user trigger assigns 'student' by default
    // For instructor role, an admin would typically promote them
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false });
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },
}));

// Selectors
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUserRole = (state: AuthState) => state.user?.role;
