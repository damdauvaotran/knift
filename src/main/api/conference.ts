import { Router, Request, Response } from 'express';
import { buildRes } from '../utils/response';
import { validateUser } from '../middleware/auth';
import {
  getAllConference
} from '../services/conference_service';

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



export default router;
