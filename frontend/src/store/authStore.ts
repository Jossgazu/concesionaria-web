import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { setAuthToken } from '../services/api';
import { queryClient } from '../hooks/useQueryProvider';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        setAuthToken(token);
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        setAuthToken(null);
        queryClient.clear();
      },
      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } as User })),
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
