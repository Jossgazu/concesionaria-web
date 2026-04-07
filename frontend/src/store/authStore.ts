import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  initAuth: () => Promise<void>;
}

const STORAGE_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const getUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getTokenFromStorage = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  isLoading: true,
  login: (user, token) => {
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
  updateUser: (userData) => {
    const currentUser = getUserFromStorage();
    const updatedUser = { ...(currentUser || {}), ...userData };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    set({ user: updatedUser as User });
  },
  setLoading: (isLoading) => set({ isLoading }),
  initAuth: async () => {
    const token = getTokenFromStorage();
    if (token) {
      set({ isLoading: true });
      try {
        const response = await authService.me();
        const user = response.data.data || response.data;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
