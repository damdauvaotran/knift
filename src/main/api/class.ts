import { Router, Request, Response } from 'express';

import { validateUser } from '../middleware/auth';
import { getUserIdByRequest } from '../utils/request';
const { buildRes } = require('../utils/response');
const {
  getAllClassByUserId,
  createClassWithUserId,
} = require('../services/class_service');
const router = Router();

/**
 * @swagger
 *
 * /class:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get class info
 *    description: Return class info
 *    tags:
 *      - class
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
 *              $ref: '#/definitions/Class'
 */

router.get('/class', validateUser, async (req: Request, res: Response) => {
  try {
    const limit = req.query?.limit
    const offset = req.query?.offset
    const userId = await getUserIdByRequest(req);
    const classesInfo = await getAllClassByUserId(userId, {limit, offset});
    return buildRes(res, true, classesInfo);
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

/**
 * @swagger
 *
 * /class:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: Create class info
 *    description: Create class info
 *    tags:
 *      - class
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *          - name
 *          - startTime
 *          - endTime
 *          - subjectId
 *          properties:
 *            name:
 *              type: string
 *            startTime:
 *              type: integer
 *            endTime:
 *              type: integer
 *            subjectId:
 *              type: integer
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
 *              $ref: '#/definitions/Class'
 */

router.post('/class', validateUser, async (req: Request, res: Response) => {
  try {
    const userId = await  getUserIdByRequest(req);
    const { name, startTime, endTime, subjectId } = req.body;
    const classInstance = await createClassWithUserId(userId, {
      name,
      startTime,
      endTime,
      subjectId,
    });
    return buildRes(res, true, classInstance)
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

export default router;
