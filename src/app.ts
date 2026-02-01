import express from "express";
import router from "./routes";
import { redis } from "./config/redis";
import { apiRateLimiter } from "./middlewares/rateLimit.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { metricsMiddleware } from "./middlewares/metrics.middleware";

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(metricsMiddleware);

// Root endpoint - API documentation
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json({
    name: "FarmLokal Backend API",
    version: "1.0.0",
    description: "Hyperlocal marketplace backend with OAuth2, caching, and performance optimization",
    endpoints: {
      health: {
        method: "GET",
        url: `${baseUrl}/health`,
        description: "Health check - Redis & app status"
      },
      metrics: {
        method: "GET",
        url: `${baseUrl}/metrics`,
        description: "Application metrics - uptime, cache stats, response times, connections"
      },
      auth: {
        method: "GET",
        url: `${baseUrl}/auth/test-token`,
        description: "OAuth2 token fetch with Redis caching & distributed lock"
      },
      products: {
        method: "GET",
        url: `${baseUrl}/products`,
        description: "Product listing with pagination, search, filters & Redis caching",
        queryParams: {
          cursor: "Cursor for pagination (product ID)",
          limit: "Number of results (default: 20)",
          sort: "Sort field: id, name, price, createdAt",
          order: "ASC or DESC",
          search: "Full-text search on name & description",
          category: "Filter by category (milk, vegetables, fruits)",
          minPrice: "Minimum price filter",
          maxPrice: "Maximum price filter"
        },
        examples: [
          `${baseUrl}/products`,
          `${baseUrl}/products?limit=10&sort=price&order=ASC`,
          `${baseUrl}/products?category=milk&minPrice=20&maxPrice=50`,
          `${baseUrl}/products?search=fresh&limit=5`
        ]
      },
      externalApiA: {
        method: "GET",
        url: `${baseUrl}/external/api-a`,
        description: "External API integration with timeout, retries & exponential backoff"
      },
      webhookApiB: {
        method: "POST",
        url: `${baseUrl}/webhooks/api-b`,
        description: "Webhook endpoint with idempotency (requires X-Event-ID header)",
        headers: {
          "Content-Type": "application/json",
          "X-Event-ID": "unique-event-id-123"
        },
        body: { event: "order.created", data: {} }
      }
    },
    features: [
      "OAuth2 Client Credentials with Redis token caching",
      "Cursor-based pagination (1M+ products)",
      "Redis caching with configurable TTL",
      "Rate limiting (100 req/min per IP)",
      "Circuit breaker pattern",
      "Retry with exponential backoff",
      "Webhook idempotency",
      "Connection pooling",
      "Centralized error handling",
      "Performance metrics endpoint"
    ],
    techStack: ["Node.js", "TypeScript", "Express", "MySQL", "Redis", "Sequelize"]
  });
});

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
