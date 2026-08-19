import { Router } from 'express';
import { DiagnosisController } from './diagnosis.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Secure all diagnostic engine routes
router.use(authGuard);

router.post('/run', DiagnosisController.run);

export { router as diagnosisRouter };
