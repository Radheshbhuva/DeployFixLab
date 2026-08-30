import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from './database.service';

export class DatabaseController {
  /**
   * Retrieves comprehensive database telemetry & Supabase monitoring metrics.
   */
  public static async getMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await DatabaseService.getMetrics();
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Triggers a live ping probe to measure latency.
   */
  public static async ping(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ping = await DatabaseService.measurePingLatency();
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: ping,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Executes a read-only diagnostic SQL statement.
   */
  public static async executeQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_QUERY',
            message: 'A valid SQL query string must be provided in request body.',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await DatabaseService.executeDiagnosticQuery(query);
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        statusCode: 400,
        error: {
          code: 'QUERY_EXECUTION_ERROR',
          message: error.message || 'Error executing diagnostic SQL statement',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}
