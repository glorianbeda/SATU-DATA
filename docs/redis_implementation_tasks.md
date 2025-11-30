# Redis Caching Implementation Tasks

## 1. Infrastructure Setup
- [x] Add Redis service to `docker-compose.yml`.
- [x] Update backend environment variables to include Redis connection details (`REDIS_HOST`, `REDIS_PORT`).

## 2. Backend Dependencies & Configuration
- [x] Install `redis` package in backend (`npm install redis`).
- [x] Create `backend/lib/redis.js` (or `utils/redis.js`) to handle Redis connection and export the client.

## 3. Reusable Cache Helper/Middleware
- [x] Create a reusable cache utility/middleware (`backend/utils/cache.js`).
    - [x] **Features:**
        - [x] Easy `get` and `set` methods.
        - [x] Default TTL of 1 hour (3600 seconds).
        - [x] Flexible key generation (support custom keys or auto-generate based on Route + UserID).
        - [x] Graceful error handling (if Redis is down, bypass cache and fetch from DB).

## 4. Implementation
- [x] Implement caching on `GET /api/profile`.
    - [x] Cache Key Strategy: `profile:{userId}`.
    - [x] Invalidate cache on Profile Update (`PUT /api/profile`).

## 5. Verification
- [ ] Verify Redis container is running.
- [ ] Verify data is being cached (faster response time on second hit).
- [ ] Verify cache invalidation works (updating profile clears the cache).
