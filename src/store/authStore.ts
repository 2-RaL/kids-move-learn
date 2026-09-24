import { create } from 'zustand';
import { apiUrl } from '../config/api';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showAdminPanel: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setShowAdminPanel: (show: boolean) => void;
  clearError: () => void;
}

const TOKEN_KEY = 'kml-auth-token';
const USER_KEY = 'kml-auth-user';

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: !!getStoredToken(),
  isLoading: false,
  error: null,
  showAdminPanel: false,

  setShowAdminPanel: (showAdminPanel) => set({ showAdminPanel }),
  clearError: () => set({ error: null }),

  login: async (username: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Giriş uğursuz oldu');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Giriş zamanı xəta baş verdi',
        isAuthenticated: false,
      });
      return false;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      showAdminPanel: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const res = await fetch(apiUrl('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        get().logout();
        return;
      }

      const data = await res.json();
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      set({ user: data.user, isAuthenticated: true });
    } catch {
      // In case of network error, keep offline token if available
    }
  },
}));
