import jwt from 'jsonwebtoken';
import db from '../models';
import { Request, Response } from 'express';

const { User } = db;

const jwtPrivateKey = process.env.PRIVATE_KEY_JWT || '!bE8JX7!owd!W67&XEU9kw2W';

interface IJWTBody {
  id?: string;
}

export const getUserIdByToken = async (token: string) => {
  const decodedData = await jwt.verify(token, jwtPrivateKey);
  const id = (<IJWTBody>decodedData)?.id;
  return id;
};

export const getTokenByRequest = (req: Request) =>
  req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

export const validateUser = (req: Request, res: Response, next: Function) => {
  const asyncFunction = async () => {
    const authToken = getTokenByRequest(req);
    try {
      // Keep try catch logic
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
