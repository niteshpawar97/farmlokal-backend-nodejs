import express from "express";
import router from "./routes";
import { redis } from "./config/redis";
import { apiRateLimiter } from "./middlewares/rateLimit.middleware";
import { errorHandler } from "./middlewares/error.middleware";
const app = express();

app.set("trust proxy", 1);
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

// Apply rate limiting globally
app.use(apiRateLimiter);

app.use(router);
app.use(errorHandler);
export default app;
