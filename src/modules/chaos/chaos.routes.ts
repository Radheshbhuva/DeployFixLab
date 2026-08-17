import { Router } from 'express';
import { ChaosController } from './chaos.controller';
import { authGuard } from '../../middleware/authGuard';
import { roleGuard } from '../../middleware/roleGuard';

const router = Router();

// Secure all chaos engine routes
router.use(authGuard);

router.post('/inject', roleGuard(['ADMIN', 'INSTRUCTOR']), ChaosController.inject);
router.post('/verify', ChaosController.verify);

export { router as chaosRouter };
