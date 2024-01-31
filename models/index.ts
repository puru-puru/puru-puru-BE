import { Sequelize, Model, DataTypes } from "sequelize";
import { config } from '../config/config'

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: "mysql",
    // timezone: "+09:00",
    dialectOptions: { charset: "utf8mb4", dateStrings: true, typeCast: true },
    define: {
      timestamps: true,
    },
  }
);

export default sequelize;
// 님아 소변좀 보는 김에 커피 좀 타ㅣ옴