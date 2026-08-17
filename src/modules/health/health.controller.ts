import { Request, Response } from 'express';

export class HealthController {
  public static getHealth(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'deployfix-backend',
    });
  }

  public static getLive(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
    });
  }

  public static getReady(_req: Request, res: Response): void {
    // For now, simple readiness check. Later this will verify database connectivity.
    res.status(200).json({
      status: 'ok',
    });
  }
}
