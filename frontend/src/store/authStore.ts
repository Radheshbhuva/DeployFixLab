import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth.types';
import { UserRole, Permission, hasPermission as checkPermission, hasAnyPermission } from '@/types/rbac.types';

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
  switchDemoRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: Boolean(user && accessToken),
          isLoading: false,
        }),
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
      switchDemoRole: (role: UserRole) => {
        const { user } = get();
        if (!user) return;
        set({
          user: {
            ...user,
            role,
          },
        });
      },
    }),
    {
      name: 'deployfix-lab-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
