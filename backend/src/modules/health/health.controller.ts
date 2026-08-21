import { Request, Response } from 'express';
import { checkDatabaseHealth } from '../../config/database';
import * as os from 'os';

export class HealthController {
  /**
   * Full health report: uptime + database liveness + memory metrics.
   * Used by Render healthCheckPath and the smoke verification protocol.
   */
  public static async getHealth(_req: Request, res: Response): Promise<void> {
    const dbHealthy = await checkDatabaseHealth();
    const memUsage = process.memoryUsage();

    const payload = {
      status: dbHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'deployfix-backend',
      uptime: Math.floor(process.uptime()),
      database: {
        connected: dbHealthy,
        latencyMs: null, // reserved for future latency probe
      },
      memory: {
        heapUsedMB: +(memUsage.heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMB: +(memUsage.heapTotal / 1024 / 1024).toFixed(2),
        rssMB: +(memUsage.rss / 1024 / 1024).toFixed(2),
      },
      system: {
        platform: os.platform(),
        freeMemMB: +(os.freemem() / 1024 / 1024).toFixed(2),
        totalMemMB: +(os.totalmem() / 1024 / 1024).toFixed(2),
      },
    };

    res.status(dbHealthy ? 200 : 503).json(payload);
  }

  /**
   * Kubernetes / Render liveness probe — always returns 200 if process is alive.
   */
  public static getLive(_req: Request, res: Response): void {
    res.status(200).json({ status: 'ok' });
  }

  /**
   * Readiness probe — returns 200 only when the database is reachable.
   */
  public static async getReady(_req: Request, res: Response): Promise<void> {
    const dbHealthy = await checkDatabaseHealth();
    if (dbHealthy) {
      res.status(200).json({ status: 'ok', database: 'connected' });
    } else {
      res.status(503).json({ status: 'not_ready', database: 'disconnected' });
    }
  }
}
