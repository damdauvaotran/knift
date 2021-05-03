import { Router, Request, Response } from 'express';

import { validateUser } from '../middleware/auth';
import { getUserIdByRequest } from '../utils/request';
const { buildRes } = require('../utils/response');
const {
  getAllClassByUserId,
  createClassWithUserId,
  updateClass,
  deleteClass,
  getClassByUserId
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
    const limit = req.query?.limit;
    const offset = req.query?.offset;
    const userId = await getUserIdByRequest(req);
    const classesInfo = await getAllClassByUserId(userId, { limit, offset });
    return buildRes(res, true, classesInfo);
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

/**
 * @swagger
 *
 * /class/{classId}:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get class info by id
 *    description: Return class info
 *    tags:
 *      - class
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: classId
 *        type: number
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

 router.get('/class/:id', validateUser, async (req: Request, res: Response) => {
  try {
    const {id: classId} =  req.params
    const userId = await getUserIdByRequest(req);
    const classesInfo = await getClassByUserId(userId, classId);
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
 *            subjectId:
 *              type: integer
 *            detail:
 *              type: string
 *            startTime:
 *              type: integer
 *            endTime:
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
    const userId = await getUserIdByRequest(req);
    const { name, startTime, endTime, subjectId, detail } = req.body;
    const classInstance = await createClassWithUserId(userId, {
      name,
      startTime,
      endTime,
      subjectId,
      detail,
    });
    return buildRes(res, true, classInstance);
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

/**
 * @swagger
 *
 * /class/{classId}:
 *  put:
 *    security:
 *      - Bearer: []
 *    summary: Update class info
 *    description: Update class info
 *    tags:
 *      - class
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: classId
 *        schema:
 *          type: integer
 *        required: true
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
 *            subjectId:
 *              type: integer
 *            detail:
 *              type: string
 *            startTime:
 *              type: integer
 *            endTime:
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

router.put(
  '/class/:classId',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { name, startTime, endTime, subjectId, detail } = req.body;
      const classId = req.params?.classId ?? '0';
      const trueClassId = parseInt(classId, 10);
      const classInstance = await updateClass(trueClassId, {
        name,
        startTime,
        endTime,
        subjectId,
        detail,
      });
      return buildRes(res, true, classInstance);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

/**
 * @swagger
 *
 * /class/{classId}:
 *  delete:
 *    security:
 *      - Bearer: []
 *    summary: Update class info
 *    description: Update class info
 *    tags:
 *      - class
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: classId
 *        schema:
 *          type: integer
 *        required: true
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

router.delete(
  '/class/:classId',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const classId = req.params?.classId ?? '0';
      const trueClassId = parseInt(classId, 10);
      const classInstance = await deleteClass(trueClassId);
      return buildRes(res, true, classInstance);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

export default router;
