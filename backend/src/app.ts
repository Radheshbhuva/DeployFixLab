import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { healthRouter } from './modules/health/health.routes';
import { authRouter } from './modules/auth/auth.routes';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { dashboardRouter } from './modules/dashboard/dashboard.routes';
import { labsRouter } from './modules/labs/labs.routes';
import { chaosRouter } from './modules/chaos/chaos.routes';
import { evidenceRouter } from './modules/evidence/evidence.routes';
import { diagnosisRouter } from './modules/diagnosis/diagnosis.routes';
import { recoveryRouter } from './modules/recovery/recovery.routes';
import { auditRouter } from './modules/audit/audit.routes';
import { adminRouter } from './modules/admin/admin.routes';

// Load environment variables
dotenv.config();

const app = express();

// --- CORS Configuration ---
// Whitelists only the configured frontend origin; allows cookies/auth headers
const corsOptions: cors.CorsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
};

// Global Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Mounting Health Routes directly under root
app.use('/', healthRouter);

// Mounting Auth Routes
app.use('/api/v1/auth', authRouter);

// Mounting Task Routes
app.use('/api/v1/tasks', tasksRouter);

// Mounting Dashboard Routes
app.use('/api/v1/dashboard', dashboardRouter);

// Mounting Labs Routes
app.use('/api/v1/labs', labsRouter);

// Mounting Chaos Routes
app.use('/api/v1/chaos', chaosRouter);

// Mounting Evidence Routes
app.use('/api/v1/evidence', evidenceRouter);

// Mounting Diagnosis Routes
app.use('/api/v1/diagnosis', diagnosisRouter);

// Mounting Recovery Routes
app.use('/api/v1/recovery', recoveryRouter);

// Mounting Audit Routes
app.use('/api/v1/audit', auditRouter);

// Mounting Admin Routes
app.use('/api/v1/admin', adminRouter);

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
