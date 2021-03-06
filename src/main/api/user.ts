import { Router, Request, Response } from 'express';

import {
  validateUser,
  getUserIdByToken,
  getTokenByRequest,
} from '../middleware/auth';
const { buildRes } = require('../utils/response');
const UserService = require('../services/user_service');
const router = Router();

/**
 * @swagger
 *
 * /user:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get user info
 *    description: Return user info
 *    tags:
 *      - user
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
 *            data:
 *              type: object
 *              $ref: '#/definitions/User'
 */

router.get('/user', validateUser, async (req: Request, res: Response) => {
  try {
    const token = getTokenByRequest(req);
    const userId = await getUserIdByToken(String(token));
    const userInfo = await UserService.getUserInfo(userId);
    return buildRes(res, true, userInfo);
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

export default router;
