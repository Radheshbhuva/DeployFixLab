import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/rbac.types';

/**
 * Middleware factory to enforce access control based on user roles.
 */
export const roleGuard = (allowedRoles: Role[]) => {
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

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        error: {
          code: 'FORBIDDEN_INSUFFICIENT_ROLE',
          message: 'Access forbidden: Insufficient role permissions',
          requiredRoles: allowedRoles,
          currentRole: req.user.role,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
};
