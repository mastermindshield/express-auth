import { Router } from 'express';
import { UserController } from './controller/UserController';
import { AuthController } from './controller/AuthController';
import { AuthMiddleware } from './middleware/auth';

const usercontroller = new UserController();
const authcontroller = new AuthController();

export const router = Router();

router.post('/create', usercontroller.createUser);
router.get('/users', AuthMiddleware,usercontroller.index);
router.post('/auth', authcontroller.authenticate);