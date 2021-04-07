import { Sequelize, ModelOptions, BIGINT, STRING } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'permission',
    {
      permissionId: {
        type: BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      action: {
        type: STRING,
        allowNull: false,
      },
      resource: {
        type: STRING,
        allowNull: false,
      },
    },
    config
  );

/**
 * @swagger
 *
 * definitions:
 *  Permission:
 *    type: object
 *    properties:
 *      permissionID:
 *        type: integer
 *      action:
 *        type: string
 *      resource:
 *        type: string
 */
