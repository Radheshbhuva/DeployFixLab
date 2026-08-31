import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';

const router = Router();

// Protect all admin/ops endpoints with authentication
router.use(authGuard);

// User Governance & RBAC Endpoints (Admin only)
router.use(roleGuard(['ADMIN']));
router.get('/users', AdminController.getUsers);
router.patch('/users/:userId/role', AdminController.updateRole);
router.get('/stats', AdminController.getStats);

export { router as adminRouter };
