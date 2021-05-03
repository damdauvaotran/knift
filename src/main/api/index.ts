const express = require('express');

import authRouter from './auth';
import userRouter from './user';
import classRouter from './class';
import subjectRouter from './subject';
import lessonRouter from './lesson';
import conferenceRouter from './conference';
import invitationRouter from './invitation';
import studentRouter from './student';

const router = express.Router();

router.use('/', authRouter);
router.use('/', userRouter);
router.use('/', classRouter);
router.use('/', subjectRouter);
router.use('/', lessonRouter);
router.use('/', conferenceRouter);
router.use('/', invitationRouter);
router.use('/', studentRouter);

// GET home page.
router.get('/', (_req: any, res: any) => {
  res.render('index', { title: 'Express' });
});

export default router;
