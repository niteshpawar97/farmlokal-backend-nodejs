

# FarmLokal Backend Assignment

This repository contains the backend implementation for the **FarmLokal Backend Engineering Assignment**.
The focus of this project is **performance, reliability, and clean system design**, aligned with real-world production use cases in a hyperlocal marketplace.

---

## 🚀 Tech Stack

* **Node.js** (TypeScript)
* **Express.js**
* **MySQL** (via Sequelize)
* **Redis** (caching, locking)
* Optional: Docker (not required for core functionality)

---

## 📐 Architecture Overview

```
Client
  |
Express API
  |
  ├── Auth Module (OAuth2 + Redis Lock)
  ├── External API Module
  │     ├── API A (Sync: retry + backoff)
  │     └── API B (Webhook: idempotency)
  ├── Products Module (Performance-critical)
  |
Redis (Cache, Locks)
MySQL (Products, Webhook Events)
```

Key principles:

* Read-heavy paths optimized with Redis
* Cursor-based pagination for scalability
* Idempotent async processing
* Minimal DB queries per request

---

## 🔐 Authentication (OAuth2 – Client Credentials)

### Implementation Details

* OAuth2 Client Credentials flow
* Token fetched from a **mock OAuth provider** (allowed by assignment)
* Access token cached in Redis with TTL
* Automatic refresh on expiry
* **Redis-based distributed lock** prevents concurrent token fetches

### Why mock OAuth?

The assignment focuses on **token lifecycle management, caching, and concurrency**, not provider setup.
The implementation is provider-agnostic and can be easily switched to Auth0 / Okta.

---

## 🌐 External API Integrations

### API A – Synchronous

* Public mock API used
* Features:

  * Request timeout
  * Retries with exponential backoff (200ms → 400ms → 800ms)
* Failures are isolated and do not block the main system

### API B – Webhook / Callback

* Callback endpoint implemented
* **Idempotency ensured** using a unique `event_id`
* Processed events stored in MySQL with a unique constraint
* Duplicate events are safely ignored
* Fast `200 OK` response enables safe retries by the provider

---

## 📦 Product Listing API (Performance Critical)

### Endpoint

```
GET /products
```

### Features

* Cursor-based pagination (no OFFSET)
* Sorting by `price`, `createdAt`, `name`
* Search on `name` and `description`
* Filters:

  * Category
  * Price range

### Performance Optimizations

* Proper MySQL indexes:

  * category
  * price
  * createdAt
  * FULLTEXT (name, description)
* Redis query-based caching
* Short cache TTL (30 seconds)
* Cache keys generated using a hash of query parameters

### Dataset Simulation

* ~220,000 product records seeded locally
* Schema, indexing, and pagination are designed to scale beyond **1 million+ records**

---

## ⚡ Performance Testing

### Manual Testing (Postman)

Dataset size: ~220,000 products
Pagination: Cursor-based
Cache: Redis (TTL: 30s)

| Endpoint                             | Response Time |
| ------------------------------------ | ------------- |
| GET /products?limit=20               | 2–8 ms        |
| GET /products?cursor=100000&limit=20 | 2–8 ms        |
| GET /products?cursor=200000&limit=20 | 2–8 ms        |
| GET /products?category=milk&limit=20 | 2–8 ms        |

### Cache Validation

| Attempt             | Source             | Time   |
| ------------------- | ------------------ | ------ |
| First request       | MySQL (cache miss) | 6–8 ms |
| Subsequent requests | Redis (cache hit)  | 2–6 ms |

Cache hits and misses were verified via application logs.

---

## 🧠 Caching Strategy

* **OAuth token cache**: Redis with TTL + lock
* **Product list cache**: Query-based Redis keys
* **TTL-based invalidation** (30s)
* Write operations can invalidate `products:*` keys if required

This strategy balances **freshness and performance** without over-complicating cache management.

---

## 🛡 Reliability & Stability

Implemented:

* Redis caching
* Retry + exponential backoff
* Connection pooling (MySQL via Sequelize)
* Idempotent webhook handling

These choices ensure graceful degradation under failures.

---

## 🧩 Trade-offs Made

* Used mock OAuth instead of a real provider to focus on lifecycle logic
* Manual performance testing instead of automated load tests to keep scope tight
* Seeded ~220k records locally instead of full 1M for practicality, while ensuring scalability

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js 18+
* MySQL
* Redis

### Install & Run

```bash
npm install
npm run dev
```

### Seed Products

```bash
npm run seed-products
```

---

## 📌 API Summary

* `GET /auth/test-token`
* `GET /external/api-a`
* `POST /webhooks/api-b`
* `GET /products`
* `GET /health`

---

## Load Testing (k6)

Load testing was performed using k6 to validate performance under concurrent access.

**Test configuration**
- Dataset size: 1,000,000 products
- Virtual users: 20
- Duration: 30 seconds
- Request pattern: Random cursor-based pagination

**Results**
- P95 response time: ~14.5ms
- Average response time: ~5ms
- Error rate: 0%

The API consistently met the performance requirement of P95 < 200ms, even when
querying deep cursors on a one-million-record dataset.


## 📤 Submission Notes

The primary focus of this assignment was **performance optimization, Redis usage, and production-ready backend patterns**, as these are critical for a hyperlocal, read-heavy system like FarmLokal.

---



