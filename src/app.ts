import express from "express";
import router from "./routes";
import { redis } from "./config/redis";
import { errorHandler } from "./middlewares/error.middleware";
const app = express();

app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const pong = await redis.ping();
    res.json({
      status: "ok",
      redis: pong,
    });
  } catch {
    res.status(500).json({
      status: "error",
      redis: "down",
    });
  }
});

app.use(router);
app.use(errorHandler);
export default app;
