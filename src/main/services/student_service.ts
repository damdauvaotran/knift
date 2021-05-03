import db from '../models';
import { Role } from '../types/common';

export interface IGetAllStudent {
  limit?: number;
  offset?: number;
}

export const getAllStudentFromClass = async (
  { limit, offset }: IGetAllStudent,
  classId: number
) => {
  const trueLimit = limit ?? 10;
  const trueOffset = offset ?? 0;
  const studentList = await db.User.findAll({
    limit: trueLimit,
    offset: trueOffset,
    include: [
      {
        model: db.Class,
        where: {
          classId,
        },
        attributes: [],
      },
      {
        model: db.Role,
        where: {
          name: Role.STUDENT,
        },
        attributes: [],
      },
    ],
    raw: true
  });
  return {
    students: studentList.map((lesson: any) => ({
      userId: lesson.userId,
      displayName: lesson.displayName,
    })),
    limit: trueLimit,
    offset: trueOffset,
  };
};

export const deleteStudentFromClass = async (
  studentId: number,
  classId: number
) => {
  await db.UserClass.destroy({
    where: {
      userId:studentId,
      classId,
    },
  });

  return { studentId };
};
