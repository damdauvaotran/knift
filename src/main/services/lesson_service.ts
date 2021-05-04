import { where } from 'sequelize/types';
import db from '../models';

export interface IGetAllLesson {
  limit?: number;
  offset?: number;
}

export interface ICreateLesson {
  name: string;
  classId: number;
  detail: string;
  startTime: number;
  endTime: number;
}

export interface IUpdateLesson {
  name: string;
  detail: string;
  startTime: number;
  endTime: number;
}

export const createLesson = async (lessonInfo: ICreateLesson) => {
  const lesson = await db.Lesson.create({
    name: lessonInfo.name,
    classId: lessonInfo.classId,
    startTime: lessonInfo.startTime,
    endTime: lessonInfo.endTime,
    detail: lessonInfo.detail
  });
  return { lesson };
};

export const getAllLesson = async ({ limit, offset }: IGetAllLesson) => {
  const trueLimit = limit ?? 10;
  const trueOffset = offset ?? 0;
  const lessonList = await db.Lesson.findAll({
    limit: trueLimit,
    offset: trueOffset,
  });
  return {
    lessons: lessonList,
    limit: trueLimit,
    offset: trueOffset,
  };
};

export const getLessonById = async (lessonId: number) => {
  const lesson = await db.Lesson.findOne({
    where: {
      lessonId,
    },
  });
  return { lesson };
};

export const updateLessonById = async (
  lessonId: number,
  updateLesson: IUpdateLesson
) => {
  const lesson = await db.Lesson.update(
    { name: updateLesson.name },
    {
      where: {
        lessonId,
      },
    }
  );

  return { lesson };
};

export const deleteLessonById = async (lessonId: number) => {
  await db.Lesson.destroy({
    where: {
      lessonId,
    },
  });

  return { lessonId };
};

export const getAllLessonWithClassId = async (
  { limit, offset }: IGetAllLesson,
  classId: number
) => {
  const trueLimit = limit ?? 10;
  const trueOffset = offset ?? 0;
  const lessonList = await db.Lesson.findAll({
    limit: trueLimit,
    offset: trueOffset,
    include: {
      model: db.Class,
      where: {
        classId,
      },
      attributes: []
    },
  });

  const total = await db.Lesson.count({
    include: {
      model: db.Class,
      where: {
        classId,
      },
      attributes: []
    },
  });
  return {
    lessons: lessonList,
    limit: trueLimit,
    offset: trueOffset,
    total
  };
};
