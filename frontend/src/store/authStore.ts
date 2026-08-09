import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'INSTRUCTOR';
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'usr-1',
        name: 'Alex Mercer',
        email: 'alex.mercer@deployfix.io',
        role: 'ADMIN',
        createdAt: '2026-08-01T10:00:00Z',
      },
      token: 'mock-jwt-token-deployfix-lab',
      isAuthenticated: true,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateProfile: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
    }),
    {
      name: 'deployfix-auth-storage',
    }
  )
);
