import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis";

export const apiRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args: string[]) => redis.call(args[0], ...args.slice(1)) as Promise<any>,
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again later.",
  },
});
