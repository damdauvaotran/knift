import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import db from '../models';
import { env } from '../constants';
import {
  getTokenByRequest,
  getUserIdByToken,
  IJWTBody,
} from '../utils/request';

import { getAsync } from '../cached';

const { User } = db;

const jwtPrivateKey = env.PRIVATE_KEY_JWT;

export const validateUser = (req: Request, res: Response, next: Function) => {
  const asyncFunction = async () => {
    const authToken = getTokenByRequest(req);
    try {
      // Keep try catch logic
      const tokenInBlacklist = await getAsync(authToken);
      if (tokenInBlacklist !== null) {
        res.json({
          success: false,
          message: 'You do no have permission to perform this action',
        });
      }
      const id = await getUserIdByToken(String(authToken));
      const requestUser = await User.findOne({ where: { userId: id } });
      if (requestUser) {
        next();
      } else {
        res.json({
          success: false,
          message: 'You do no have permission to perform this action',
        });
      }
    } catch (e) {
      // Wrong token will be push to here
      res.json({
        success: false,
        message: 'You do no have permission to perform this action',
      });
    }
  };
  asyncFunction();
};

export const validateAdmin = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const asyncFunction = async () => {
    const authToken =
      req.headers.authorization &&
      req.headers.authorization.replace('Bearer ', '');
    try {
      // Keep try catch logic
      const decodedData = await jwt.verify(String(authToken), jwtPrivateKey);
      const { id } = <IJWTBody>decodedData;
      const requestUser = await User.findOne({ where: { userId: id } });

      if (1 + 1 === 2) {
        next();
      } else {
        res.json({
          success: false,
          message: 'You do no have permission to perform this action',
          data: requestUser,
        });
      }
    } catch (e) {
      // Wrong token will be push to here
      res.json({
        success: false,
        message: 'You do no have permission to perform this action',
      });
    }
  };
  asyncFunction();
};
