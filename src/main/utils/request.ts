import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../constants';

const jwtPrivateKey = env.PRIVATE_KEY_JWT;

export interface IJWTBody {
  id?: string;
}

export const getUserIdByToken = async (token: string = '') => {
  const decodedData = await jwt.verify(token, jwtPrivateKey);
  const id = (<IJWTBody>decodedData)?.id;
  return id;
};

export const getTokenByRequest = (req: Request) =>
  req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

export const getUserIdByRequest = (req: Request)=>{
  const token  = getTokenByRequest(req)
  return getUserIdByToken(token)
}
