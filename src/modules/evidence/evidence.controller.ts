import { Request, Response, NextFunction } from 'express';
import { EvidenceService } from './evidence.service';

export class EvidenceController {
  /**
   * Retrieves Nginx access and error logs.
   */
  public static async getNginxLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const logs = await EvidenceService.getNginxLogs(req.user.id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { logs },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves Docker container states.
   */
  public static async getDockerContainers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const containers = await EvidenceService.getDockerContainers(req.user.id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { containers },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves application configuration files.
   */
  public static async getConfigs(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const configs = await EvidenceService.getConfigs(req.user.id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { configs },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}
