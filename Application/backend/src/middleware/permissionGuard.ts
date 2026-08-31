import { Request, Response, NextFunction } from 'express';
import { Permission, hasPermission, hasAllPermissions, hasAnyPermission } from '../types/rbac.types';

/**
 * Middleware factory to enforce fine-grained capability checks based on permissions.
 */
export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        error: {
          code: 'UNAUTHORIZED_NO_TOKEN',
          message: 'Authentication required',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!hasPermission(req.user.role, permission)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        error: {
          code: 'FORBIDDEN_INSUFFICIENT_PERMISSIONS',
          message: `Access forbidden: Missing required permission '${permission}'`,
          requiredPermission: permission,
          currentRole: req.user.role,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

/**
 * Middleware requiring all specified permissions.
 */
export const requireAllPermissions = (permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        error: {
          code: 'UNAUTHORIZED_NO_TOKEN',
          message: 'Authentication required',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!hasAllPermissions(req.user.role, permissions)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        error: {
          code: 'FORBIDDEN_INSUFFICIENT_PERMISSIONS',
          message: 'Access forbidden: Missing one or more required permissions',
          requiredPermissions: permissions,
          currentRole: req.user.role,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};

/**
 * Middleware requiring any one of the specified permissions.
 */
export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        error: {
          code: 'UNAUTHORIZED_NO_TOKEN',
          message: 'Authentication required',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        error: {
          code: 'FORBIDDEN_INSUFFICIENT_PERMISSIONS',
          message: 'Access forbidden: Insufficient permissions for this action',
          requiredPermissions: permissions,
          currentRole: req.user.role,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};
