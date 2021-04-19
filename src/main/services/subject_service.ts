import db from '../models';

export interface IGetAllSubject {
  limit?: number;
  offset?: number;
}

export interface ICreateSubject {
  name: string;
}

export interface IUpdateSubject {
  name: string;
}

export const createSubject = async (subjectInfo: ICreateSubject) => {
  const subject = await db.Subject.create({
    name: subjectInfo.name,
  });
  return { subject };
};

export const getAllSubject = async ({ limit, offset }: IGetAllSubject) => {
  const trueLimit = limit ?? 10;
  const trueOffset = offset ?? 0;
  const subjectList = await db.Subject.findAll({
    limit: trueLimit,
    offset: trueOffset,
  });
  return {
    subjects: subjectList,
    limit: trueLimit,
    offset: trueOffset,
  };
};

export const getSubjectById = async (subjectId: number) => {
  const subject = await db.Subject.findOne({
    where: {
      subjectId,
    },
  });
  return { subject };
};

export const updateSubjectById = async (
  subjectId: number,
  updateSubject: IUpdateSubject
) => {
  const subject = await db.Subject.update(
    { name: updateSubject.name },
    {
      where: {
        subjectId,
      },
    }
  );

  return { subject };
};

export const deleteSubjectById = async (subjectId: number) => {
  const subject = await db.Subject.destroy({
    where: {
      subjectId,
    },
  });

  return { subjectId };
};
