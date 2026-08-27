import { useAuthStore } from '@/store/authStore';
import { UserRole, ROLE_PERMISSIONS } from '@/types/rbac.types';

/**
 * Custom React hook for declarative permission evaluation and role checks.
 */
export function usePermission() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRole = useAuthStore((state) => state.hasRole);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canAccess = useAuthStore((state) => state.canAccess);

  const role: UserRole = user?.role || 'STUDENT';
  const permissions = ROLE_PERMISSIONS[role] || [];

  return {
    user,
    role,
    isAuthenticated,
    permissions,
    isAdmin: role === 'ADMIN',
    isInstructor: role === 'INSTRUCTOR',
    isStudent: role === 'STUDENT',
    hasRole,
    hasPermission,
    canAccess,
  };
}
