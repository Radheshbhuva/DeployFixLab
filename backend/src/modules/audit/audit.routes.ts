import { Router } from 'express';
import { AuditController } from './audit.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';

const router = Router();

// Secure all audit logs endpoints
router.use(authGuard);
router.use(roleGuard(['ADMIN', 'INSTRUCTOR']));

router.get('/', AuditController.getLogs);

export { router as auditRouter };
