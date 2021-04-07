import { Sequelize, ModelOptions, BIGINT, STRING, DATE } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'lesson',
    {
      lessonId: {
        type: BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      startTime: {
        type: DATE,
        allowNull: false,
      },
      endTime: {
        type: DATE,
        allowNull: false,
      },
    },
    config
  );

/**
 * @swagger
 *
 * definitions:
 *  Lesson:
 *    type: object
 *    properties:
 *      lessonId:
 *        type: integer
 *      name:
 *        type: string
 *      startTime:
 *        type: integer
 *      endTime:
 *        type: integer
 */
