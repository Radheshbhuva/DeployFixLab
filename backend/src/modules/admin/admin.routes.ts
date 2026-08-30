import { Router } from 'express';
import { AdminController } from './admin.controller';
import { DatabaseController } from './database.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';

const router = Router();

// Protect all admin/ops endpoints with authentication
router.use(authGuard);

// Database Monitoring & Management Endpoints (Accessible to ADMIN and INSTRUCTOR/DevOps SREs)
router.get('/database/metrics', roleGuard(['ADMIN', 'INSTRUCTOR']), DatabaseController.getMetrics);
router.post('/database/ping', roleGuard(['ADMIN', 'INSTRUCTOR']), DatabaseController.ping);
router.post('/database/query', roleGuard(['ADMIN']), DatabaseController.executeQuery);

// User Governance & RBAC Endpoints (Admin only)
router.use(roleGuard(['ADMIN']));
router.get('/users', AdminController.getUsers);
router.patch('/users/:userId/role', AdminController.updateRole);
router.get('/stats', AdminController.getStats);

export { router as adminRouter };
