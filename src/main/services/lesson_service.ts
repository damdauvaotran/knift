import db from '../models';

export interface IGetAllLesson {
  limit?: number;
  offset?: number;
}

export interface ICreateLesson {
  name: string;
  classId: number;
  startTime: number;
  endTime: number;
}

export interface IUpdateLesson {
  name: string;
}

export const createLesson = async (lessonInfo: ICreateLesson) => {
  const lesson = await db.Lesson.create({
    name: lessonInfo.name,
    classId: lessonInfo.classId,
    startTime: lessonInfo.startTime,
    endTime: lessonInfo.endTime,
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
  const lesson = await db.Lesson.destroy({
    where: {
      lessonId,
    },
  });

  return { lessonId };
};