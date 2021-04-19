import { Router, Request, Response } from 'express';
import { buildRes } from '../utils/response';
import { validateUser } from '../middleware/auth';
import {
  getAllLesson,
  getLessonById,
  createLesson,
  deleteLessonById,
  updateLessonById,
} from '../services/lesson_service';

const router = Router();

/**
 * @swagger
 *
 * /lesson:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get lesson info
 *    description: Return lesson info
 *    tags:
 *      - lesson
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
 *              $ref: '#/definitions/Lesson'
 */

router.get('/lesson', validateUser, async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    const trueLimit = limit ? parseInt(String(limit), 10) : undefined;
    const trueOffset = offset ? parseInt(String(offset), 10) : undefined;
    const lessonsInfo = await getAllLesson({
      limit: trueLimit,
      offset: trueOffset,
    });
    return buildRes(res, true, lessonsInfo);
  } catch (e) {
    return buildRes(res, false, e.toString());
  }
});

/**
 * @swagger
 *
 * /lesson/{lessonId}:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get lesson by Id
 *    description: Get lesson
 *    tags:
 *      - lesson
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: lessonId
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Lesson'
 */

router.get(
  '/lesson/:id',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const trueId = parseInt(String(id), 10);
      const lessonInfo = await getLessonById(trueId);
      return buildRes(res, true, lessonInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

/**
 * @swagger
 *
 * /lesson:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: Create lesson
 *    description: create lesson
 *    tags:
 *      - lesson
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
 *          - classId
 *          properties:
 *            name:
 *              type: string
 *            classId:
 *              type: number
 *            startTime:
 *              type: number
 *            endTime:
 *              type: number
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Lesson'
 */

router.post(
  '/lesson',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { name, classId, startTime, endTime } = req.body;
      const trueName = String(name);
      const trueClassId = parseInt(classId, 10)
      const trueStartTime = parseInt(startTime, 10)
      const trueEndTime = parseInt(endTime, 10)

      const lessonInfo = await createLesson({ name: trueName, classId: trueClassId, startTime: trueStartTime, endTime: trueEndTime });
      return buildRes(res, true, lessonInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

export default router;