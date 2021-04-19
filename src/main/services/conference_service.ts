import db from '../models';

export interface IGetAllConference {
  limit?: number;
  offset?: number;
}

export const getAllLesson = async ({ limit, offset }: IGetAllConference) => {
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
