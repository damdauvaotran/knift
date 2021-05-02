import { Router, Request, Response } from 'express';
import { buildRes } from '../utils/response';
import { validateUser } from '../middleware/auth';
import {
  generateTimeOutInvitation,
  handleInvitation,
  getInvitationInfo,
} from '../services/invitation_service';
import { getUserIdByRequest } from '../utils/request';

const router = Router();

/**
 * @swagger
 *
 * /invitation:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: Create inviation
 *    description: Return lesson info
 *    tags:
 *      - invitation
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *          - classId
 *          - expire
 *          properties:
 *            classId:
 *              type: number
 *            expire:
 *              type: number
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

router.post(
  '/invitation',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { classId, expire } = req.body;
      const invitationUrl = await generateTimeOutInvitation(classId, expire);
      return buildRes(res, true, { invitationUrl });
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

/**
 * @swagger
 *
 * /invitation/accept:
 *  post:
 *    security:
 *      - Bearer: []
 *    summary: Accept invitation
 *    description: Accepct invitation to class room
 *    tags:
 *      - invitation
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          required:
 *          - invitation
 *          properties:
 *            invitation:
 *              type: string
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

router.post(
  '/invitation/accept',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { invitation } = req.body;
      const userId = await getUserIdByRequest(req);
      const invitationUrl = await handleInvitation(invitation, Number(userId));
      return buildRes(res, true, { invitationUrl });
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

/**
 * @swagger
 *
 * /invitation/{invitation}:
 *  get:
 *    security:
 *      - Bearer: []
 *    summary: Get invitation info
 *    description: invitation to class room
 *    tags:
 *      - invitation
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: invitation
 *        required: true
 *        type: string
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
  '/invitation/:invitation',
  validateUser,
  async (req: Request, res: Response) => {
    try {
      const { invitation } = req.params;
      const invitationInfo = await getInvitationInfo(invitation ?? '');
      console.log(invitationInfo)
      return buildRes(res, true, { invitation: invitationInfo });
    } catch (e) {
      return buildRes(res, false, e.toString());
    }
  }
);

export default router;
