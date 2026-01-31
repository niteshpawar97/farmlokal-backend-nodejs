import dotenv from "dotenv"

dotenv.config()

export const env = {
    port: process.env.PORT || "3000",
    redisUrl: process.env.REDIS_URL || "",

    
  mysqlHost: process.env.MYSQL_HOST || "localhost",
  mysqlPort: process.env.MYSQL_PORT || "3306",
  mysqlDb: process.env.MYSQL_DB || "",
  mysqlUser: process.env.MYSQL_USER || "",
  mysqlPassword: process.env.MYSQL_PASSWORD || "",
  
}