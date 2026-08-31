import { Router } from 'express';
import { LabsController } from './labs.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Secure all labs catalog routes
router.use(authGuard);

router.get('/', LabsController.list);
router.post('/:id/start', LabsController.start);

export { router as labsRouter };
