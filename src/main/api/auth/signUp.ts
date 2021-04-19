import { Router, Request, Response } from 'express';

import { validationResult } from 'express-validator';
import { buildRes } from '../../utils/response';
import UserService from '../../services/user_service';

const router = Router();

/**
 * @swagger
 *
 * /auth/signup:
 *  post:
 *    summary: Sign up
 *    description: create account
 *    tags:
 *      - auth
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *          - username
 *          - password
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *            gender:
 *              type: string
 *            displayName:
 *              type: string
 *            email:
 *              type: string
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

router.post('/signup', async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildRes(res, false, 'Invalid input');
  }
  const userDTO = req.body;

  try {
    await UserService.signUp(userDTO);
    return buildRes(res, true, {});
  } catch (e) {
    return buildRes(res, false, e);
  }
});

export default router;
