import db from '../models';
import { Op } from 'sequelize';
import conference_data from '../seeding/conference_data';
import { where } from 'sequelize/types';

export const addAttendance = async (userId: number, conferenceId: number) => {
  const attend = await db.Attendance.create({
    userId,
    conferenceId,
  });
  return { attend };
};

export const getAttendanceList = async (conferenceId: number) => {
  const attendanceList = await db.User.findAll({
    include: {
      model: db.Conference,
      where: { conferenceId },
      attributes: [],
    },
    attributes: ['userId', 'displayName'],
    raw: true,
  });
  const attendanceMap = new Map();
  attendanceList.forEach((element: any) => {
    attendanceMap.set(element.userId, element);
  });
  const lessonConf = await db.Lesson.findOne({
    include: {
      model: db.Conference,
      where: { conferenceId },
      attributes: [],
    },
  });
  // @ts-ignore
  const classId = lessonConf?.classId;
  console.log(classId);
  const fullStudent = await db.User.findAll({
    include: {
      model: db.Class,
      where: {
        classId,
      },
      attributes: [],
    },
    where: {
      roleId: {
        [Op.ne]: 2,
      },
    },
    attributes: ['userId', 'displayName'],
    raw: true,
  });

  const fullStudentList = fullStudent.map((student: any) => {
    if (attendanceMap.has(student.userId)) {
      return {
        ...student,
        attend: true,
        attendTime: attendanceMap.get(student.userId)[
          'conferences.attendance.createdAt'
        ],
      };
    }
    return {
      ...student,
      attend: false,
      attendTime: '',
    };
  });

  return { attendanceList, fullStudentList };
};
