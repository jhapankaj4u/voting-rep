import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validate } from '../utils/validate';
import { signupSchema, loginSchema } from '../validators/auth';

const router = Router();
router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
export default router;
