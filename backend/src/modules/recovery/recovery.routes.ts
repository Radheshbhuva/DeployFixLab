import { Router } from 'express';
import { RecoveryController } from './recovery.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Secure all recovery engine routes
router.use(authGuard);

router.get('/guide', RecoveryController.getGuide);
router.post('/execute', RecoveryController.executeStep);

export { router as recoveryRouter };
