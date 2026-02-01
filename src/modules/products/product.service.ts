import crypto from "crypto";
import { redis } from "../../config/redis";
import { env } from "../../config/env";
import { fetchProducts } from "./product.repo";
import { trackCacheHit, trackCacheMiss } from "../metrics/metrics.service";

export async function getProducts(query: any) {
  const cacheKey =
    "products:" +
    crypto.createHash("md5").update(JSON.stringify(query)).digest("hex");

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("⚡ Products cache HIT:", cacheKey);
    trackCacheHit();
    return JSON.parse(cached);
  }

  console.log("🗄️ Products cache MISS → DB query");
  trackCacheMiss();

  const products = await fetchProducts(query);

  // TTL configurable via PRODUCT_CACHE_TTL env var (default: 30s)
  await redis.setex(cacheKey, env.productCacheTtl, JSON.stringify(products));

  return products;
}
