import db from '../models';
import { confStatus } from '../constants';

export interface IGetAllConference {
  limit?: number;
  offset?: number;
}

export interface ICreateConference {
  lessonId: number;
  startTime: number;
  endTime: number;
}

export const getAllConference = async ({
  limit,
  offset,
}: IGetAllConference) => {
  const trueLimit = limit ?? 10;
  const trueOffset = offset ?? 0;
  const conferenceList = await db.Conference.findAll({
    limit: trueLimit,
    offset: trueOffset,
  });
  return {
    conferences: conferenceList,
    limit: trueLimit,
    offset: trueOffset,
  };
};

export const getAllConferenceWithLessonId = async (
  { limit, offset }: IGetAllConference,
  lessonId: number
) => {
  const trueLimit = limit ?? 10;
  const trueOffset = offset ?? 0;
  const conferenceList = await db.Conference.findAll({
    limit: trueLimit,
    offset: trueOffset,
    include: [
      {
        model: db.Lesson,
        where: {
          lessonId,
        },
        attributes: [],
      },
    ],
  });
  return {
    conferences: conferenceList,
    limit: trueLimit,
    offset: trueOffset,
  };
};

export const createConference = async (conferenceInfo: ICreateConference) => {
  const conference = await db.Conference.create({
    status: confStatus.waiting,
    startTime: conferenceInfo.startTime,
    endTime: conferenceInfo.endTime,
    lessonId: conferenceInfo.lessonId,
  });
  return { lesson: conference };
};

export const endConference = async (conferenceId: number) => {
  console.log("ending")
  const conference = await db.Conference.update(
    {
      status: confStatus.ended,
    },
    { where: { conferenceId } }
  );
  return { lesson: conference };
};
