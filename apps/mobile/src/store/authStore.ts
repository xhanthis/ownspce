import { create } from 'zustand';
import { storage, api } from '../api/client';

interface User {
  id: string;
  username: string;
  theme: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  hydrate: () => {
    const token = storage.getString('token');
    const userStr = storage.getString('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (username: string, password: string) => {
    const res = await api<{ token: string; user: User }>('/api/auth/token', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    storage.set('token', res.token);
    storage.set('user', JSON.stringify(res.user));
    set({ user: res.user, token: res.token });
  },

  signup: async (username: string, password: string) => {
    await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    const res = await api<{ token: string; user: User }>('/api/auth/token', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    storage.set('token', res.token);
    storage.set('user', JSON.stringify(res.user));
    set({ user: res.user, token: res.token });
  },

  logout: () => {
    storage.delete('token');
    storage.delete('user');
    set({ user: null, token: null });
  },
}));
