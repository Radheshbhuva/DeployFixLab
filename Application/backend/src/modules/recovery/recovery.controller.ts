import { Request, Response, NextFunction } from 'express';
import { RecoveryService } from './recovery.service';
import { AuditService } from '../audit/audit.service';

export class RecoveryController {
  /**
   * Retrieves the recovery guide.
   */
  public static async getGuide(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { labId } = req.query;
      const guide = await RecoveryService.getRecoveryGuide(
        req.user.id,
        labId as string | undefined
      );

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { guide },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (
        error.message === 'No active failed lab scenario session found' ||
        error.message === 'Lab scenario not found'
      ) {
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

  /**
   * Interactive recovery step execution verifier.
   */
  public static async executeStep(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const { labId, stepOrder } = req.body;

      if (!labId || typeof stepOrder !== 'number') {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'labId and stepOrder (number) are required in request body',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await RecoveryService.executeRecoveryStep(req.user.id, labId, stepOrder);

      await AuditService.log(req.user.id, 'EXECUTE_RECOVERY_STEP', 'RECOVERY_PLAN', {
        labId,
        stepOrder,
        resolved: result.resolved,
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (
        error.message === 'Lab scenario not found' ||
        error.message === 'Lab progress session not started' ||
        error.message.includes('Invalid stepOrder')
      ) {
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
