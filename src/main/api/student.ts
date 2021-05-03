import { Router, Request, Response } from 'express';
import { buildRes } from '../utils/response';
import { validateUser } from '../middleware/auth';
import {deleteStudentFromClass, getAllStudentFromClass} from "../services/student_service"

const router = Router();

/**
 * @swagger
 *
 * /student/class/{classId}:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get lesson info
 *    description: Return lesson info
 *    tags:
 *      - student
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
 *              $ref: '#/definitions/Lesson'
 */

 router.get(
  '/student/class/:classId',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { limit, offset } = req.query;
      const { classId } = req.params;
      const trueLimit = limit ? parseInt(String(limit), 10) : undefined;
      const trueOffset = offset ? parseInt(String(offset), 10) : undefined;
      const trueClassId = classId ? parseInt(String(classId), 10) : 1;
      const lessonsInfo = await getAllStudentFromClass(
        {
          limit: trueLimit,
          offset: trueOffset,
        },
        trueClassId
      );
      return buildRes(res, true, lessonsInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);



/**
 * @swagger
 *
 * /student/{studentId}/class/{classId}:
 *  delete:
 *    security:
 *      - Bearer: []
 *    summary: Delete student
 *    description: Delete student
 *    tags:
 *      - student
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: studentId
 *        schema:
 *          type: number
 *        required: true
 *      - in: path
 *        name: classId
 *        schema:
 *          type: number
 *        required: true
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Lesson'
 */

router.delete(
  '/student/:studentId/class/:classId',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const studentId = req.params?.studentId ?? '0';
      const trueStudentId = parseInt(studentId, 10);
      const classId = req.params?.classId ?? '0';
      const trueClassId = parseInt(classId, 10);
      const lessonInfo = await deleteStudentFromClass(trueStudentId, trueClassId);
      return buildRes(res, true, lessonInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

export default router;
