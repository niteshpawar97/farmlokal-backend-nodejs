import crypto from "crypto";
import { redis } from "../../config/redis";
import { fetchProducts } from "./product.repo";

export async function getProducts(query: any) {
  const cacheKey =
    "products:" +
    crypto.createHash("md5").update(JSON.stringify(query)).digest("hex");

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("⚡ Products cache HIT:", cacheKey);
    return JSON.parse(cached);
  }

    console.log("🗄️ Products cache MISS → DB query");

  const products = await fetchProducts(query);

  // short TTL for freshness
  await redis.setex(cacheKey, 30, JSON.stringify(products));

  return products;
}
