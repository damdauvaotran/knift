import { Sequelize, ModelOptions, BIGINT, STRING } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'subject',
    {
      subjectId: {
        type: BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
    },
    config
  );

export interface ISubjectModel {
  classId: number;
  name: string;
  startTime: number;
  endTime: number;
}

/**
 * @swagger
 *
 * definitions:
 *  Subject:
 *    type: object
 *    properties:
 *      subjectId:
 *        type: integer
 *      name:
 *        type: string
 */
