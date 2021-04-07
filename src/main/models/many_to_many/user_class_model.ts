import { Sequelize, ModelOptions, BIGINT } from 'sequelize';

export default (db: Sequelize, config: ModelOptions) =>
  db.define(
    'userClass',
    {
      userClassId: {
        type: BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
    },
    config
  );
