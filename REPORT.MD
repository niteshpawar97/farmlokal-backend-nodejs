## Performance Testing (Manual – Postman)

Dataset size: ~220,000 products  
Pagination: Cursor-based  
Cache: Redis (TTL: 30s)

### Product Listing API

| Endpoint | Result | Response Time |
|--------|-------|---------------|
| GET /products?limit=20 | 200 OK | 2–8 ms |
| GET /products?cursor=100000&limit=20 | 200 OK | 2–8 ms |
| GET /products?cursor=200000&limit=20 | 200 OK | 2–8 ms |
| GET /products?category=milk&limit=20 | 200 OK | 2–8 ms |

### Cache Behavior Validation

| Attempt | Source | Response Time |
|-------|-------|---------------|
| 1st request | MySQL (cache miss) | 6–8 ms |
| 2nd request | Redis (cache hit) | 2–6 ms |

Redis cache hits were verified using application logs.
