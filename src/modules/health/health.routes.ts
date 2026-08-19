import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();

router.get('/health', HealthController.getHealth);
router.get('/live', HealthController.getLive);
router.get('/ready', HealthController.getReady);

export { router as healthRouter };
