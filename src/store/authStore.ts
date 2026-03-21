import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, LoginResponse } from '@/types/auth.types';

interface AuthStore extends AuthState {
  login: (response: LoginResponse) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  // message: string | null;  // ✅ Add this
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (response: LoginResponse) => {
        // Store access token in memory (not persisted)
        (window as any).__ACCESS_TOKEN__ = response.accessToken;
        
        set({
          user: response.user,
          accessToken: response.accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        // Clear memory token
        (window as any).__ACCESS_TOKEN__ = null;
        
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user info, not access token
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper to get access token from memory
export const getAccessToken = () => (window as any).__ACCESS_TOKEN__;