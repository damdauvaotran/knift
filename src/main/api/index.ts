const express = require('express');

import authRouter from './auth';
import userRouter from './user';
import classRouter from './class';
import subjectRouter from './subject';
import lessonRouter from './lesson';
import conferenceRouter from './conference';

const router = express.Router();

router.use('/', authRouter);
router.use('/', userRouter);
router.use('/', classRouter);
router.use('/', subjectRouter);
router.use('/', lessonRouter);
router.use('/', conferenceRouter);

// GET home page.
router.get('/', (_req: any, res: any) => {
  res.render('index', { title: 'Express' });
});

export default router;
