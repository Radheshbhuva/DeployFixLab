import { Request, Response, NextFunction } from 'express';
import { DiagnosisService } from './diagnosis.service';

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

      const result = await DiagnosisService.runDiagnosis(req.user.id);

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
