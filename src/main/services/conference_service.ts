import db from '../models';

export interface IGetAllConference {
  limit?: number;
  offset?: number;
}

export const getAllConference = async ({ limit, offset }: IGetAllConference) => {
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
