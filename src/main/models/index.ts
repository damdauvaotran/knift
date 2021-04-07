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

// Seeding data for dev purpose
// const migrationFilm = require('../mock/films_data');
// const migrationEpList = require('../mock/episode_data');
// const migrationProcess = require('../mock/progress_data');
// const migrationUser = require('../mock/user_data');
// const migrationActor = require('../mock/actor_data');
// const migrationCategory = require('../mock/category_data');
// const migrationList = require('../mock/list_data');
// const migrationFilmActor = require('../mock/film_actor_data');
// const migrationFilmCategory = require('../mock/film_category_data');
// const migrationFilmList = require('../mock/film_list_data');

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

Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Subject.hasMany(Class, { foreignKey: 'subjectId' });
Class.belongsTo(Class, { foreignKey: 'subjectId' });

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

const init = () => {
  console.log('Initializing database');
  db.sync({ force: env.DATABASE_FORCE_UPDATE }).then(async () => {
    console.log('Database & tables created!');
    // const listFilm = await Films.findAll();

    // // Seeding data
    // if (listFilm.length === 0) {
    //   console.log('Empty film list, Start seeding data');
    //   await Users.bulkCreate(migrationUser);
    //   await Films.bulkCreate(migrationFilm);
    //   await Episodes.bulkCreate(migrationEpList);
    //   await Progresses.bulkCreate(migrationProcess);
    //   await Actors.bulkCreate(migrationActor);
    //   await Categories.bulkCreate(migrationCategory);
    //   await Lists.bulkCreate(migrationList);
    //   await FilmsCategories.bulkCreate(migrationFilmCategory);
    //   await FilmsActors.bulkCreate(migrationFilmActor);
    //   await FilmsLists.bulkCreate(migrationFilmList);
    // } else {
    //   console.log('Db has exist, Migration canceled');
    // }
  });
};

export default {
  User,
  init,
};
