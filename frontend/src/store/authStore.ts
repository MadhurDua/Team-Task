import { create } from 'zustand';
import { api } from '../services/api';
import type { User } from '../lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string; role?: 'admin' | 'member' }) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const persistedUser = localStorage.getItem('ttm_user');
const persistedToken = localStorage.getItem('ttm_token');

export const useAuthStore = create<AuthState>((set) => ({
  user: persistedUser ? JSON.parse(persistedUser) : null,
  token: persistedToken,
  loading: false,
  async login(payload) {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('ttm_token', data.data.token);
      localStorage.setItem('ttm_user', JSON.stringify(data.data.user));
      set({ user: data.data.user, token: data.data.token });
    } finally {
      set({ loading: false });
    }
  },
  async signup(payload) {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/signup', payload);
      localStorage.setItem('ttm_token', data.data.token);
      localStorage.setItem('ttm_user', JSON.stringify(data.data.user));
      set({ user: data.data.user, token: data.data.token });
    } finally {
      set({ loading: false });
    }
  },
  async hydrate() {
    if (!localStorage.getItem('ttm_token')) return;
    const { data } = await api.get('/auth/me');
    localStorage.setItem('ttm_user', JSON.stringify(data.data));
    set({ user: data.data });
  },
  logout() {
    localStorage.removeItem('ttm_token');
    localStorage.removeItem('ttm_user');
    set({ user: null, token: null });
  },
  setUser(user) {
    localStorage.setItem('ttm_user', JSON.stringify(user));
    set({ user });
  }
}));
