import { Request, Response, NextFunction } from 'express';
import { DiagnosisService } from './diagnosis.service';
import { AuditService } from '../audit/audit.service';
import prisma from '../../prisma';

export class DiagnosisController {
  /**
   * Evaluates active telemetry signals and runs the diagnostic reasoning pipeline.
   */
  public static async run(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      // Tiered usage check per role
      const dailyLimits: Record<string, number> = {
        STUDENT: 5,
        INSTRUCTOR: 100,
        ADMIN: Infinity,
      };

      const userRole = req.user.role || 'STUDENT';
      const limit = dailyLimits[userRole] ?? 5;

      // Check daily diagnosis count for students
      if (limit !== Infinity) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const countToday = await prisma.auditLog.count({
          where: {
            userId: req.user.id,
            action: 'RUN_DIAGNOSIS',
            createdAt: { gte: oneDayAgo },
          },
        });

        if (countToday >= limit) {
          res.status(429).json({
            success: false,
            statusCode: 429,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: `Daily AI diagnosis limit reached for your role (${userRole}: ${limit}/day). Please upgrade or try again tomorrow.`,
            },
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      const result = await DiagnosisService.runDiagnosis(req.user.id);

      await AuditService.log(req.user.id, 'RUN_DIAGNOSIS', 'AI_DIAGNOSIS', {
        role: userRole,
      });

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
}
