import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { listUsersQuerySchema, updateRoleSchema } from './admin.schema';
import { Role } from '../../types/rbac.types';

export class AdminController {
  /**
   * Lists users with filtering and pagination.
   */
  public static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedQuery = listUsersQuerySchema.safeParse(req.query);

      if (!parsedQuery.success) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'Invalid query parameters',
            details: parsedQuery.error.format(),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await AdminService.listUsers(parsedQuery.data);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a target user's role.
   */
  public static async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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

      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'User ID is required in URL parameters',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const parsedBody = updateRoleSchema.safeParse(req.body);

      if (!parsedBody.success) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'Invalid role provided',
            details: parsedBody.error.format(),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const updatedUser = await AdminService.updateUserRole(
        req.user.id,
        userId,
        parsedBody.data.role as Role
      );

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { user: updatedUser },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(404).json({
          success: false,
          statusCode: 404,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (error.message === 'Self-demotion is prevented to avoid administrative lockout') {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'SELF_DEMOTION_FORBIDDEN',
            message: error.message,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      next(error);
    }
  }

  /**
   * Retrieves summary statistics on user roles.
   */
  public static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getUserStats();

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}
