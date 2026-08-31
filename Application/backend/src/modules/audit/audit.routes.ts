import { Router } from 'express';
import { AuditController } from './audit.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';

const router = Router();

// Secure all audit logs endpoints
router.use(authGuard);

// Personal audit log for any authenticated user
router.get('/personal', AuditController.getPersonalLogs);

// Global audit logs (Restricted to Admin and Instructor)
router.get('/', roleGuard(['ADMIN', 'INSTRUCTOR']), AuditController.getLogs);

export { router as auditRouter };
