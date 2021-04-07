import { Router, Request, Response } from 'express';
const { validationResult } = require('express-validator');

const { buildRes } = require('../../utils/response');
const UserService = require('../../services/user_service');

const router = Router();

/**
 * @swagger
 *
 * /auth/login:
 *  post:
 *    summary: Login
 *    description: Return token
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

router.post('/login', async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return buildRes(res, false, 'Invalid input');
  }

  const userDTO = req.body;
  try {
    const token = await UserService.login(userDTO);
    return buildRes(res, true, { token });
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

export default router;
