import { redis } from "../../config/redis";
import { sequelize } from "../../config/mysql";

// In-memory metrics (resets on restart)
const metrics = {
  requests: {
    total: 0,
    byEndpoint: {} as Record<string, number>,
  },
  cache: {
    hits: 0,
    misses: 0,
  },
  responseTimes: [] as number[],
  startTime: Date.now(),
};

// Track a request
export function trackRequest(endpoint: string, responseTimeMs: number) {
  metrics.requests.total++;
  metrics.requests.byEndpoint[endpoint] = (metrics.requests.byEndpoint[endpoint] || 0) + 1;

  // Keep last 1000 response times for percentile calculation
  metrics.responseTimes.push(responseTimeMs);
  if (metrics.responseTimes.length > 1000) {
    metrics.responseTimes.shift();
  }
}

// Track cache hit/miss
export function trackCacheHit() {
  metrics.cache.hits++;
}

export function trackCacheMiss() {
  metrics.cache.misses++;
}

// Calculate percentile
function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// Get all metrics
export async function getMetrics() {
  const uptimeSeconds = Math.floor((Date.now() - metrics.startTime) / 1000);

  // Check circuit breaker status
  const circuitOpen = await redis.get("external:api-a:circuit");

  // Check Redis connection
  let redisStatus = "down";
  try {
    await redis.ping();
    redisStatus = "up";
  } catch {
    redisStatus = "down";
  }

  // Check MySQL connection
  let mysqlStatus = "down";
  let poolStats = null;
  try {
    await sequelize.authenticate();
    mysqlStatus = "up";
    const pool = (sequelize as any).connectionManager.pool;
    if (pool) {
      poolStats = {
        size: pool.size,
        available: pool.available,
        pending: pool.pending,
      };
    }
  } catch {
    mysqlStatus = "down";
  }

  // Calculate response time stats
  const times = metrics.responseTimes;
  const avgResponseTime = times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;

  // Memory usage
  const memoryUsage = process.memoryUsage();

  return {
    uptime: {
      seconds: uptimeSeconds,
      human: formatUptime(uptimeSeconds),
    },
    requests: {
      total: metrics.requests.total,
      byEndpoint: metrics.requests.byEndpoint,
    },
    cache: {
      hits: metrics.cache.hits,
      misses: metrics.cache.misses,
      hitRate: metrics.cache.hits + metrics.cache.misses > 0
        ? ((metrics.cache.hits / (metrics.cache.hits + metrics.cache.misses)) * 100).toFixed(2) + "%"
        : "N/A",
    },
    responseTime: {
      samples: times.length,
      avgMs: avgResponseTime,
      p50Ms: percentile(times, 50),
      p95Ms: percentile(times, 95),
      p99Ms: percentile(times, 99),
    },
    circuitBreaker: {
      apiA: circuitOpen ? "open" : "closed",
    },
    connections: {
      redis: redisStatus,
      mysql: mysqlStatus,
      mysqlPool: poolStats,
    },
    memory: {
      heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
    },
  };
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}
