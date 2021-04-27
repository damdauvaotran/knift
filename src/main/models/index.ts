import { Sequelize, ModelOptions } from 'sequelize';

import { env } from '../constants';

// Single model
import UserModel from './user_model';
import RoleModel from './role_model';
import PermissionModel from './permission_model';
import ClassModel from './class_model';
import ConferenceModel from './conference_model';
import LessonModel from './lesson_model';
import SubjectModel from './subject_model';

// Many to many model

import RolePermissionModel from './many_to_many/role_permission_model';
import UserClassModel from './many_to_many/user_class_model';
import AttendanceModel from './many_to_many/attendance_model';

// Seeding data
import userSeed from '../seeding/user_data';
import roleSeed from '../seeding/role_data';
import permissionSeed from '../seeding/permission_data';
import rolePermissionSeed from '../seeding/permission_data';
import subjectSeed from '../seeding/subject_data';
import classSeed from '../seeding/class_data';
import lessonSeed from '../seeding/lesson_data';
import userClassSeed from '../seeding/user_class_data';
import conferenceSeed from '../seeding/conference_data';

const DATABASE_NAME = env.DATABASE_NAME || 'math_app';
const DATABASE_USERNAME = env.DATABASE_USERNAME || 'root';
const DATABASE_PASSWORD = env.DATABASE_PASSWORD || '12345678';
const DATABASE_URL = env.DATABASE_URL || 'localhost';
const DATABASE_PORT = env.DATABASE_PORT || 3306;

const db: Sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: DATABASE_URL,
    port: DATABASE_PORT,
    dialect: 'mysql',
    timezone: '+07:00',
    retry: {
      max: 100,
      // timeout: 60 * 60 * 1000,
    },
    logQueryParameters: true,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const tableConfig: ModelOptions = {
  underscored: true,
  timestamps: true,
  // sequelize: db,
  charset: 'utf8',
  collate: 'utf8_general_ci',
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
};

// Single table
const User = UserModel(db, tableConfig);
const Role = RoleModel(db, tableConfig);
const Permission = PermissionModel(db, tableConfig);
const Class = ClassModel(db, tableConfig);
const Conference = ConferenceModel(db, tableConfig);
const Lesson = LessonModel(db, tableConfig);
const Subject = SubjectModel(db, tableConfig);

// Many to many table
const RolePermission = RolePermissionModel(db, tableConfig);
const UserClass = UserClassModel(db, tableConfig);
const Attendance = AttendanceModel(db, tableConfig);

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Subject.hasMany(Class, { foreignKey: 'subjectId' });
Class.belongsTo(Subject, { foreignKey: 'subjectId' });

Class.hasMany(Lesson, { foreignKey: 'classId' });
Lesson.belongsTo(Class, { foreignKey: 'classId' });

Lesson.hasMany(Conference, { foreignKey: 'lessonId' });
Conference.belongsTo(Lesson, { foreignKey: 'lessonId' });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
});

User.belongsToMany(Class, { through: UserClass, foreignKey: 'userId' });
Class.belongsToMany(User, { through: UserClass, foreignKey: 'classId' });

User.belongsToMany(Conference, { through: Attendance, foreignKey: 'userId' });
Conference.belongsToMany(User, {
  through: Attendance,
  foreignKey: 'conferenceId',
});

const init = () => {
  console.log('Initializing database');
  db.sync({ force: env.DATABASE_FORCE_UPDATE }).then(async () => {
    console.log('Database & tables created!');
    const roles = await Role.findAll();

    // Seeding data
    // await User.bulkCreate(userSeeding);
    if (roles.length === 0) {
      console.log('Empty film list, Start seeding data');
      try {
        await Role.bulkCreate(roleSeed);
        await Permission.bulkCreate(permissionSeed);
        await RolePermission.bulkCreate(rolePermissionSeed);
        await User.bulkCreate(userSeed);
        await Subject.bulkCreate(subjectSeed);
        await Class.bulkCreate(classSeed);
        await UserClass.bulkCreate(userClassSeed);
        await Lesson.bulkCreate(lessonSeed);
        await Conference.bulkCreate(conferenceSeed);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Db has exist, Seeding canceled');
    }
  });
};

export default {
  User,
  Role,
  Permission,
  Class,
  Conference,
  Lesson,
  Subject,
  RolePermission,
  UserClass,
  Attendance,
  init,
};
