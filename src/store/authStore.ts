import { create } from "zustand";
import type { AuthState, User } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined') {
    // Clear user from localStorage to force sign-in page on start/reload
    localStorage.removeItem('user');
    return null;
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  loading: false,
  error: null,

  isDarkMode: typeof window !== 'undefined' ? (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) : false,

  toggleTheme: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      if (typeof window !== 'undefined') {
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
      return { isDarkMode: newDarkMode };
    });
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: { user: User } = await response.json();
      // Ensure currentRole is set from roles array if missing
      if (data.user && !data.user.currentRole && data.user.roles && data.user.roles.length > 0) {
        data.user.currentRole = data.user.roles[0];
      }
      // Create user object with firstName and lastName parsed from name
      if (data.user && data.user.name) {
        const nameParts = data.user.name.trim().split(' ');
        const userWithParsedName = {
          ...data.user,
          firstName: nameParts[0],
          lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
        };
        set({ user: userWithParsedName, loading: false, error: null });
      } else {
        set({ user: data.user, loading: false, error: null });
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const user = await response.json();

      // Optionally, you can automatically sign in the user after registration
      set({ user, loading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    // Placeholder for Google sign-in implementation
    set({ error: 'Google sign-in not implemented yet', loading: false });
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  switchRole: async (newRole: 'student' | 'faculty' | 'admin' | 'hod') => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/users/${useAuthStore.getState().user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRole: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to switch role');
      }

      const updatedUser = await response.json();

      set((state) => {
        if (!state.user) {
          throw new Error("No user is signed in");
        }
        // Persist the updated user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return {
          user: updatedUser,
          loading: false,
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  impersonateUser: async () => {
    set({ loading: true, error: null });
    // Placeholder for impersonation implementation
    set({ error: 'Impersonation not implemented yet', loading: false });
  },
}));
