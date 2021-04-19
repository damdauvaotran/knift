import { Router, Request, Response } from 'express';
import { buildRes } from '../utils/response';
import { validateUser } from '../middleware/auth';
import {
  getAllSubject,
  getSubjectById,
  createSubject,
  deleteSubjectById,
  updateSubjectById,
} from '../services/subject_service';

const router = Router();

/**
 * @swagger
 *
 * /subject:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get subject info
 *    description: Return subject info
 *    tags:
 *      - subject
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
 *              $ref: '#/definitions/Subject'
 */

router.get('/subject', validateUser, async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    const trueLimit = limit ? parseInt(String(limit), 10) : undefined;
    const trueOffset = offset ? parseInt(String(offset), 10) : undefined;
    const subjectsInfo = await getAllSubject({
      limit: trueLimit,
      offset: trueOffset,
    });
    return buildRes(res, true, subjectsInfo);
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

/**
 * @swagger
 *
 * /subject/{subjectId}:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get subject by Id
 *    description: Get subject
 *    tags:
 *      - subject
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: subjectId
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Subject'
 */

router.get(
  '/subject/:id',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trueId = parseInt(String(id), 10);
      const subjectInfo = await getSubjectById(trueId);
      return buildRes(res, true, subjectInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

/**
 * @swagger
 *
 * /subject:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: Create subject
 *    description: create subject
 *    tags:
 *      - subject
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
 *          properties:
 *            name:
 *              type: string
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Subject'
 */

router.post(
  '/subject',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const trueName = String(name);

      const subjectInfo = await createSubject({ name: trueName });
      return buildRes(res, true, subjectInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

export default router;
