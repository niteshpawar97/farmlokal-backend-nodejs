import Redis from "ioredis"
import { env } from "./env"

export const redis = new Redis(env.redisUrl)

redis.on("connect", () => {
    console.log(`Redis connected: ok`);
})

redis.on("error", (err) => {
    console.error("Redis error: ", err);
    
})