     
     
        Request
          ↓
        getAccessToken()
          ↓
        Redis check (token?)
          ↓
        Yes → return
        No  → acquire Redis lock
                  ↓
              fetch from OAuth provider
                  ↓
              store in Redis with TTL

## Design: Product Listing API

      Client
        ↓
      /products
        ↓
      Redis cache (query-hash)
        ↓ (MISS)
      MySQL (indexed, cursor-based)
        ↓
      Redis set (short TTL)



``` SQL CODE for Table ```
```
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category ON products(category);
CREATE INDEX idx_price ON products(price);
CREATE INDEX idx_createdAt ON products(createdAt);
CREATE FULLTEXT INDEX idx_search ON products(name, description);

```