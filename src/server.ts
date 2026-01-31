import app from "./app";
import { env } from "./config/env";
import { sequelize } from "./config/mysql";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (err) {
    console.error("❌ MySQL connection failed", err);
    process.exit(1);
  }
}

start();
