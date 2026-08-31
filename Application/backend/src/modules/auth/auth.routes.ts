import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/oauth', AuthController.oauth);
router.get('/me', authGuard, AuthController.me);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

export { router as authRouter };
