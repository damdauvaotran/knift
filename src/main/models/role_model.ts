import { Sequelize, ModelOptions, BIGINT, STRING } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'role',
    {
      roleId: {
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

/**
 * @swagger
 *
 * definitions:
 *  Role:
 *    type: object
 *    properties:
 *      roleID:
 *        type: integer
 *      name:
 *        type: string
 */
