import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/auth.types';
import { UserRole, Permission, hasPermission as checkPermission, hasAnyPermission } from '@/types/rbac.types';

const getSafeStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage;
    }
  } catch (e) {}

  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null, accessToken: string | null) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  canAccess: (options: { roles?: UserRole[]; permissions?: Permission[] }) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user, accessToken) => {
        if (user) {
          const resolvedFullName =
            user.fullName || (user as any).name || user.email?.split('@')[0] || 'User';
          user.fullName = resolvedFullName;
        }
        set({
          user,
          accessToken,
          isAuthenticated: Boolean(user && accessToken),
          isLoading: false,
        });
      },
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      hasRole: (allowedRoles) => {
        const { user } = get();
        if (!user || !user.role) return false;
        return allowedRoles.includes(user.role);
      },
      hasPermission: (permission) => {
        const { user } = get();
        if (!user || !user.role) return false;
        return checkPermission(user.role, permission);
      },
      canAccess: ({ roles, permissions }) => {
        const { user } = get();
        if (!user || !user.role) return false;
        const rolePassed = !roles || roles.length === 0 || roles.includes(user.role);
        const permissionsPassed =
          !permissions || permissions.length === 0 || hasAnyPermission(user.role, permissions);
        return rolePassed && permissionsPassed;
      },
    }),
    {
      name: 'deployfix-lab-auth',
      storage: createJSONStorage(getSafeStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
