import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Secure dashboard endpoint with authentication guard
router.get('/', authGuard, DashboardController.getDashboard);
router.get('/metrics', authGuard, DashboardController.getMetrics);
router.get('/services', authGuard, DashboardController.getServices);
router.get('/activity', authGuard, DashboardController.getActivity);

export { router as dashboardRouter };
