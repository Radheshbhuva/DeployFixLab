import { Router } from 'express';
import { TasksController } from './tasks.controller';
import { authGuard } from '../../middleware/authGuard';

const router = Router();

// Secure all task routes using the authentication guard
router.use(authGuard);

router.post('/', TasksController.create);
router.get('/', TasksController.list);
router.get('/:id', TasksController.get);
router.put('/:id', TasksController.update);
router.delete('/:id', TasksController.delete);

export { router as tasksRouter };
