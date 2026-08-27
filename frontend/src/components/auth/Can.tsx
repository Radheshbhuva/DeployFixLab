import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { UserRole, Permission } from '@/types/rbac.types';

export interface CanProps {
  do?: Permission;
  role?: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Declarative component for conditional rendering based on RBAC capabilities and roles.
 */
export const Can: React.FC<CanProps> = ({
  do: permission,
  role: requiredRoles,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasRole } = usePermission();

  let hasRoleAccess = true;
  if (requiredRoles) {
    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    hasRoleAccess = hasRole(rolesArray);
  }

  let hasPermissionAccess = true;
  if (permission) {
    hasPermissionAccess = hasPermission(permission);
  }

  const isAllowed = hasRoleAccess && hasPermissionAccess;

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
