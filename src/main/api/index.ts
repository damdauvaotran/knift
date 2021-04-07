const express = require('express');

const router = express.Router();
import authRouter from './auth';
import userRouter from './user';

router.use('/', authRouter);
router.use('/', userRouter);

// GET home page.
router.get('/', (_req: any, res: any) => {
  res.render('index', { title: 'Express' });
});

export default router;
