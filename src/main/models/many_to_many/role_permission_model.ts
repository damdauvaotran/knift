import { Sequelize, ModelOptions, BIGINT } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'rolePermission',
    {
      rolePermissionId: {
        type: BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
    },
    config
  );
