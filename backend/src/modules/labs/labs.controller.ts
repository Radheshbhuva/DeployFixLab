import { Request, Response, NextFunction } from 'express';
import { LabsService } from './labs.service';
import { AuditService } from '../audit/audit.service';

export class LabsController {
  /**
   * Lists all active lab scenarios and current user progress.
   */
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const labs = await LabsService.getLabs(req.user.id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { labs },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Starts a specific lab scenario.
   */
  public static async start(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const progress = await LabsService.startLab(req.user.id, req.params.id || '');

      await AuditService.log(req.user.id, 'START_LAB', 'LAB_SCENARIO', { labId: req.params.id });

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { progress },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'Scenario not found') {
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
}
