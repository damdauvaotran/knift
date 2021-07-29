import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

import { validateUser } from '../../middleware/auth';
import { buildRes } from '../../utils/response';
import { getTokenByRequest } from '../../utils/request';
import { client } from '../../cached';

const router = Router();

/**
 * @swagger
 *
 * /auth/logout:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: Login
 *    description: Return token
 *    tags:
 *      - auth
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          properties:
 *            success:
 *              type: boolean
 *            token:
 *              type: string
 */

router.post('/logout', async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return buildRes(res, false, 'Invalid input');
    }
  
    const authToken = getTokenByRequest(req) ?? '';
    // @ts-ignore
    const info: { exp: number } = jwt.decode(authToken);
    const remainSecond = info['exp'] - dayjs().unix();
  
    client.set(authToken, '', 'EX', remainSecond);
    return buildRes(res, true, {});
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

export default router;
