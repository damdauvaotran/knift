import { Sequelize, ModelOptions, BIGINT, STRING, DATE } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'conference',
    {
      conferenceId: {
        type: BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: {
        type: STRING,
        allowNull: false,
        comment: `one of 'WAITING', 'RUNNING', 'COMPLETED', 'CANCELED'`
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
