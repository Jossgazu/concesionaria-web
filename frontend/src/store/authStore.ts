import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const getUserFromStorage = (): User | null => {
  try {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getTokenFromStorage = (): string | null => {
  return sessionStorage.getItem('token');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  login: (user, token) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (userData) => {
    const currentUser = getUserFromStorage();
    const updatedUser = { ...(currentUser || {}), ...userData };
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser as User });
  },
}));
