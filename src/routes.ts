import { Router } from 'express';
import { UserController, createBodyValidation } from './controller/UserController';
import { AuthController, authBodyValidation } from './controller/AuthController';
import { AuthMiddleware } from './middleware/auth';

const usercontroller = new UserController();
const authcontroller = new AuthController();

export const router = Router();

router.post('/create', createBodyValidation, usercontroller.createUser);
router.get('/users', AuthMiddleware, usercontroller.index);
router.post('/auth', authBodyValidation, authcontroller.authenticate);