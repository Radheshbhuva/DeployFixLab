import { Request, Response, NextFunction } from 'express';
import { CreateTaskSchema, UpdateTaskSchema, TaskListQuerySchema } from './tasks.validation';
import { TasksService } from './tasks.service';

export class TasksController {
  /**
   * Creates a new task.
   */
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const result = CreateTaskSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'Validation failed for request payload',
            details: result.error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const task = await TasksService.createTask(req.user.id, result.data);

      res.status(201).json({
        success: true,
        statusCode: 201,
        data: { task },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a list of tasks with filters, search, sorting, and pagination.
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

      const result = TaskListQuerySchema.safeParse(req.query);
      if (!result.success) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'Validation failed for query parameters',
            details: result.error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { tasks, totalCount } = await TasksService.getTasks(req.user.id, result.data);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { tasks },
        meta: {
          page: result.data.page,
          limit: result.data.limit,
          totalCount,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves details of a specific task.
   */
  public static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const task = await TasksService.getTaskById(req.user.id, req.params.id || '');
      if (!task) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Task not found',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { task },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates an existing task.
   */
  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const result = UpdateTaskSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success: false,
          statusCode: 400,
          error: {
            code: 'INVALID_INPUT_VALIDATION',
            message: 'Validation failed for request payload',
            details: result.error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const task = await TasksService.updateTask(req.user.id, req.params.id || '', result.data);

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: { task },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'Task not found') {
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
   * Deletes a specific task.
   */
  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      await TasksService.deleteTask(req.user.id, req.params.id || '');

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: null,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message === 'Task not found') {
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
