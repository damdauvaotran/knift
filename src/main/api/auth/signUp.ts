import { Router, Request, Response } from 'express';

const { validationResult } = require('express-validator');
const { buildRes } = require('../../utils/response');
const UserService = require('../../services/user_service');

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
    return buildRes(res, false, e.toString());
  }
});

export default router;
