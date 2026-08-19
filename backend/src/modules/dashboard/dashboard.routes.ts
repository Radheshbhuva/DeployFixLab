import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Secure dashboard endpoint with authentication guard
router.get('/', authGuard, DashboardController.getDashboard);

export { router as dashboardRouter };
