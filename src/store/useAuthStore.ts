import { create } from 'zustand';
import { authRepository } from '@/repositories/authRepository';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  error: string | null;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: null,
  error: null,

  login: async (user: string, pass: string) => {
    set({ error: null });
    try {
      const data = await authRepository.login(user, pass);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('username', data.username);
      set({ isAuthenticated: true, username: data.username, error: null });
      return true;
    } catch (err: any) {
      set({ error: 'Credenciales inválidas', isAuthenticated: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    set({ isAuthenticated: false, username: null });
  },

  checkAuth: () => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('username');
    if (token && user) {
      set({ isAuthenticated: true, username: user });
    }
  }
}));
