import { Sequelize, ModelOptions, BIGINT, STRING, DATE } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'class',
    {
      classId: {
        type: BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      startTime: {
        type: DATE,
        allowNull: false,
      },
      endTime: {
        type: DATE,
        allowNull: false,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      detail: {
        type: STRING,
        allowNull: false,
      },
    },
    config
  );

export interface IClassModel {
  classId: number;
  name: string;
  startTime: number;
  endTime: number;
}

/**
 * @swagger
 *
 * definitions:
 *  Class:
 *    type: object
 *    properties:
 *      classId:
 *        type: integer
 *      startTime:
 *        type: integer
 *      endTime:
 *        type: integer
 *      name:
 *        type: string
 */
