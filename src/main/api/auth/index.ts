import { Router } from 'express';

import loginRouter from './login';
import signUpRouter from './signUp';
import logoutRouter from './logout';

const router = Router();

router.use('/auth', loginRouter);
router.use('/auth', signUpRouter);
router.use('/auth', logoutRouter);

export default router;
