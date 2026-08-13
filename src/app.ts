import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { healthRouter } from './modules/health/health.routes';

// Load environment variables
dotenv.config();

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting Health Routes directly under root
app.use('/', healthRouter);

// Basic root route for verification
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the DeployFix Lab DevOps Task Manager API',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

export default app;
