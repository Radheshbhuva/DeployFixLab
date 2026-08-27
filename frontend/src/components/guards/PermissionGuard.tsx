import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Permission, hasPermission } from '@/types/rbac.types';

export interface PermissionGuardProps {
  requiredPermission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermission,
  children,
  fallback,
  redirectTo = '/403',
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(user.role, requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <Navigate
        to={redirectTo}
        state={{ requiredPermission, currentRole: user.role }}
        replace
      />
    );
  }

  return <>{children}</>;
};
