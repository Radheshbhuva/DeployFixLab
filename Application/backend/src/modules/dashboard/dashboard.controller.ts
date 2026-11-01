import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  /**
   * Retrieves the comprehensive dashboard metrics package for the authenticated user.
   */
  public static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          statusCode: 401,
          error: {
            code: 'UNAUTHORIZED_NO_TOKEN',
            message: 'User credentials not loaded',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const dashboardData = await DashboardService.getDashboardData(req.user.id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: dashboardData,
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
      next(error);
    }
  }

  /**
   * Retrieves personalized system metrics.
   */
  public static async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-user';
      const data = await DashboardService.getDashboardData(userId);
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: data.metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves personalized microservice health.
   */
  public static async getServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-user';
      const data = await DashboardService.getDashboardData(userId);
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: data.healthServices,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves personalized recent activity.
   */
  public static async getActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-user';
      const data = await DashboardService.getDashboardData(userId);
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: data.activities,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}
