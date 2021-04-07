import { Router } from 'express';

const router = Router();

import loginRouter from './login';
import signUpRouter from './signUp';

router.use('/auth', loginRouter);
router.use('/auth', signUpRouter);

export default router;
