import { off } from 'node:process';
import db from '../models';
import { ICreateSubject } from './subject_service';

export interface IGetAllClass {
  limit?: number;
  offset?: number;
}

export interface ICreateClass {
  name: string;
  startTime: number;
  endTime: number;
  subjectId: number;
}

export const getAllClassByUserId = async (
  userId: number,
  { limit, offset }: IGetAllClass
) => {
  const trueLimit = limit ?? 10;
  const trueOffset = offset ?? 0;
  const classes = await db.Class.findAll({
    include: [
      {
        model: db.User,
        required: true,
        through: {
          attributes: [],
        },
        on: {
          userId,
        },
      },
      {
        model: db.Subject,
      }
    ],
    limit: trueLimit,
    offset: trueOffset,
  });
  return { classes, limit: trueLimit, offset: trueOffset };
};

export const getClassByUserId = async (userId: number, classId: number) => {
  const classInstance = await db.Class.findOne({
    include: [
      {
        model: db.User,
        required: true,
        through: {
          attributes: [],
        },
        on: {
          userId,
        },
      },
    ],
    where: {
      classId,
    },
  });
  return { class: classInstance };
};

export const createClassWithUserId = async (
  userId: number,
  { name, endTime, startTime, subjectId }: ICreateClass
) => {
  const classInstance = await db.Class.create({
    name,
    startTime,
    endTime,
    subjectId,
  });
  await db.UserClass.create({
    userId,
    // @ts-ignore
    classId: classInstance?.classId,
  });
  return { class: classInstance };
};
