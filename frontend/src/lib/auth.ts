import { api } from './api';

export type DisplayRole = 'farmer' | 'agricultural' | 'pharmaceutical' | 'admin';

export type UserRole =
  | 'FARMER'
  | 'AGRICULTURAL_INDUSTRY'
  | 'PHARMACEUTICAL_INDUSTRY'
  | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: DisplayRole;
  backendRole: UserRole;
}

interface SessionData {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const STORAGE_KEY = 'plant_classifier_session';

const roleMap: Record<DisplayRole, UserRole> = {
  farmer: 'FARMER',
  agricultural: 'AGRICULTURAL_INDUSTRY',
  pharmaceutical: 'PHARMACEUTICAL_INDUSTRY',
  admin: 'ADMIN',
};

const inverseRoleMap: Record<UserRole, DisplayRole> = {
  FARMER: 'farmer',
  AGRICULTURAL_INDUSTRY: 'agricultural',
  PHARMACEUTICAL_INDUSTRY: 'pharmaceutical',
  ADMIN: 'admin',
};

const persistSession = (session: SessionData) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

const readSession = (): SessionData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const authService = {
  login: async (payload: { email: string; name: string; role: DisplayRole }) => {
    try {
      const response = await api.manualLogin({
        email: payload.email,
        name: payload.name,
        role: roleMap[payload.role],
      });
      persistSession(response as SessionData);
      return authService.getCurrentUser();
    } catch {
      if (import.meta.env.MODE === 'development') {
        const mock: SessionData = {
          user: {
            id: `dev-${payload.email}`,
            email: payload.email,
            name: payload.name,
            role: roleMap[payload.role],
          },
          tokens: { accessToken: 'dev-access', refreshToken: 'dev-refresh' },
        };
        persistSession(mock);
        return authService.getCurrentUser();
      }
      throw new Error('Login failed');
    }
  },

  register: async (payload: { email: string; name: string; role: DisplayRole }) => {
    try {
      const response = await api.manualLogin({
        email: payload.email,
        name: payload.name,
        role: roleMap[payload.role],
      });
      persistSession(response as SessionData);
      return authService.getCurrentUser();
    } catch {
      if (import.meta.env.MODE === 'development') {
        const mock: SessionData = {
          user: {
            id: `dev-${payload.email}`,
            email: payload.email,
            name: payload.name,
            role: roleMap[payload.role],
          },
          tokens: { accessToken: 'dev-access', refreshToken: 'dev-refresh' },
        };
        persistSession(mock);
        return authService.getCurrentUser();
      }
      throw new Error('Registration failed');
    }
  },

  logout: async () => {
    try {
      await api.logout();
    } catch {
      // ignore network errors during logout
    } finally {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  getCurrentUser: (): User | null => {
    const session = readSession();
    if (session?.user) {
      return {
        ...session.user,
        role: inverseRoleMap[session.user.role],
        backendRole: session.user.role,
      };
    }
    return null;
  },

  getTokens: () => readSession()?.tokens ?? null,

  isAuthenticated: () => !!readSession(),
};
