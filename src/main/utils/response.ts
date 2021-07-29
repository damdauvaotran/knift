import { Response } from 'express';

export const buildRes = (res: Response, success: boolean, data: any) => {
  if (success) {
    return res.status(200).json({
      success,
      data,
    });
  }
  return res.json({
    success,
    message: data,
  });
};
