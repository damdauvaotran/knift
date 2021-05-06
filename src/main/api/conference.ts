import { Router, Request, Response } from 'express';
import { buildRes } from '../utils/response';
import { validateUser } from '../middleware/auth';
import {
  getAllConference,
  getAllConferenceWithLessonId,
  createConference,
  endConference,
} from '../services/conference_service';
import XLSX from 'xlsx';

import { getAttendanceList } from '../services/attendance_service';

const router = Router();

/**
 * @swagger
 *
 * /conference:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get lesson info
 *    description: Return lesson info
 *    tags:
 *      - conference
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
 *              $ref: '#/definitions/Conference'
 */

router.get('/conference', validateUser, async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    const trueLimit = limit ? parseInt(String(limit), 10) : undefined;
    const trueOffset = offset ? parseInt(String(offset), 10) : undefined;
    const lessonsInfo = await getAllConference({
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
 * /conference/lesson/{lessonId}:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get lesson info
 *    description: Return lesson info
 *    tags:
 *      - conference
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
 *          properties:
 *            success:
 *              type: boolean
 *            data:
 *              type: object
 *              $ref: '#/definitions/Conference'
 */

router.get(
  '/conference/lesson/:lessonId',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { limit, offset } = req.query;
      const lessonId = req.params?.lessonId;
      const trueLimit = limit ? parseInt(String(limit), 10) : undefined;
      const trueOffset = offset ? parseInt(String(offset), 10) : undefined;
      const trueLessonId = lessonId ? parseInt(String(lessonId), 10) : 1;
      const lessonsInfo = await getAllConferenceWithLessonId(
        {
          limit: trueLimit,
          offset: trueOffset,
        },
        trueLessonId
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
 * /conference:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: Create lesson
 *    description: create lesson
 *    tags:
 *      - conference
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *          - startTime
 *          - endTime
 *          - lessonId
 *          properties:
 *            lessonId:
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
 *          $ref: '#/definitions/Conference'
 */

router.post(
  '/conference',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { startTime, endTime, lessonId } = req.body;
      const trueLessonId = parseInt(lessonId, 10);
      const trueStartTime = parseInt(startTime, 10);
      const trueEndTime = parseInt(endTime, 10);

      const conferenceInfo = await createConference({
        lessonId: trueLessonId,
        startTime: trueStartTime,
        endTime: trueEndTime,
      });
      return buildRes(res, true, conferenceInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

/**
 * @swagger
 *
 * /conference/{conferenceId}/end:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: End conference
 *    description: create lesson
 *    tags:
 *      - conference
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: conferenceId
 *        required: true
 *        type: string
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Conference'
 */

router.post(
  '/conference/:conferenceId/end',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const conferenceId = req.params.conferenceId ?? '0';
      const trueConferenceId = parseInt(conferenceId, 10);
      const conferenceInfo = await endConference(trueConferenceId);
      return buildRes(res, true, conferenceInfo);
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

/**
 * @swagger
 *
 * /conference/{conferenceId}/attendance:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get attendance list of conference
 *    description: Get attendance list of conference
 *    tags:
 *      - conference
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: conferenceId
 *        schema:
 *          type: integer
 *        required: true
 *    responses:
 *      '200':
 *        description: OK
 *        schema:
 *          type: object
 *          $ref: '#/definitions/Conference'
 */

router.get(
  '/conference/:conferenceId/attendance',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const conferenceId = req.params?.conferenceId ?? '0';
      const trueConferenceId = parseInt(conferenceId, 10);
      console.log(conferenceId);
      const { attendanceList, fullStudentList } = await getAttendanceList(
        trueConferenceId
      );
      console.log(fullStudentList);
      const processedAttendanceList = fullStudentList.map((attend: any) => ({
        STT: attend.userId,
        Tên: attend.displayName,
        'Thời gian': attend.attendTime,
        'Tham gia': attend.attend ? 'x' : '',
      }));
      // @ts-ignore
      const ws = XLSX.utils.json_to_sheet(processedAttendanceList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'attendanceReport');

      /* generate buffer */
      const buf = XLSX.write(wb, {
        type: 'buffer',
        bookType: 'xlsx',
      });
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'attendance.xlsx'
      );
      return res.status(200).attachment('attendance.xlsx').send(buf);
      // res.download()
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

export default router;
