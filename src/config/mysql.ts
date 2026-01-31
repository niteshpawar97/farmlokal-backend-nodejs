import { Sequelize } from "sequelize";
import { env } from "./env";

export const sequelize = new Sequelize(
  env.mysqlDb,
  env.mysqlUser,
  env.mysqlPassword,
  {
    host: env.mysqlHost,
    port: Number(env.mysqlPort),
    dialect: "mysql",
    logging: false, // performance + clean logs
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  }
);
