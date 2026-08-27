import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/rbac.types';

/**
 * Middleware factory to enforce resource ownership with role override.
 */
export const requireOwnershipOrRole = (
  extractOwnerId: (req: Request) => string | Promise<string | null>,
  allowedOverrideRoles: Role[] = ['ADMIN']
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    try {
      const ownerId = await extractOwnerId(req);

      if (!ownerId) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Target resource not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const isOwner = req.user.id === ownerId;
      const hasOverrideRole = allowedOverrideRoles.includes(req.user.role);

      if (!isOwner && !hasOverrideRole) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          error: {
            code: 'FORBIDDEN_RESOURCE_OWNERSHIP',
            message: 'Access forbidden: You do not own this resource and lack override privileges',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to evaluate resource ownership',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };
};
