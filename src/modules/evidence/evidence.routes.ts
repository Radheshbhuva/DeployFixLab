import { Router } from 'express';
import { EvidenceController } from './evidence.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Secure all diagnostic evidence routes
router.use(authGuard);

router.get('/nginx-logs', EvidenceController.getNginxLogs);
router.get('/docker-containers', EvidenceController.getDockerContainers);
router.get('/configs', EvidenceController.getConfigs);

export { router as evidenceRouter };
