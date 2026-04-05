import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/api';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      authService
        .me()
        .then((res) => login(res.data.user || res.data, token))
        .catch(() => logout());
    }
  }, [token, user, login, logout]);

  return { user, isAuthenticated, login, logout };
}
