import { Request, Response, NextFunction } from 'express';
import { ChaosService } from './chaos.service';
import { AuditService } from '../audit/audit.service';

export class ChaosController {
  /**
   * Triggers controlled chaos failure injections (Admins/Instructors).
   */
  public static async inject(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { scenarioId, userId } = req.body;
      const targetUserId = userId || req.user.id;

      if (!scenarioId) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'scenarioId is required in request body',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await ChaosService.injectChaos(scenarioId, targetUserId);

      await AuditService.log(req.user.id, 'INJECT_CHAOS', 'CHAOS_FAILURE', {
        labId: scenarioId,
        targetUserId,
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: null,
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

  /**
   * Runs resolution probe checks to verify fixing steps.
   */
  public static async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { scenarioId } = req.body;

      if (!scenarioId) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'scenarioId is required in request body',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const progress = await ChaosService.verifyChaos(req.user.id, scenarioId);

      await AuditService.log(req.user.id, 'VERIFY_CHAOS', 'CHAOS_FAILURE', { labId: scenarioId });

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

      if (error.message === 'Lab session not started') {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
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
