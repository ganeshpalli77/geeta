# Backend Middleware

This directory contains custom middleware for the Geeta Olympiad backend:

## Available Middleware

### 1. `cache.js` - Response Caching
- In-memory LRU cache for GET requests
- Automatic cache invalidation on mutations
- Configurable TTL (Time To Live)

### 2. `logger.js` - Request Logging
- File-based logging with daily rotation
- Error tracking with separate error logs
- Performance metrics (request duration)
- Development mode console logging

## Usage Examples

### Caching Middleware
```javascript
import { cacheMiddleware, invalidateCacheMiddleware } from './middleware/cache.js';

// Cache GET requests for 5 minutes
app.use('/api/profiles', cacheMiddleware(5 * 60 * 1000), profilesRouter);

// Invalidate cache on mutations
app.use('/api/profiles', 
  invalidateCacheMiddleware(['cache:/api/profiles/']),
  profilesRouter
);
```

### Logging Middleware
```javascript
import { requestLogger, errorLogger, logger } from './middleware/logger.js';

// Request logging
app.use(requestLogger);

// Error logging
app.use(errorLogger);

// Custom logging
logger.info('User logged in', { userId: '123' });
logger.error('Database error', { error: err.message });
```

## Best Practices

1. **Caching**: Use shorter TTL for frequently changing data
2. **Logging**: Only enable request logging in development
3. **Error Handling**: Always log errors before responding
4. **Performance**: Monitor cache hit/miss ratios

## Configuration

All middleware is configurable through:
- Environment variables (`.env`)
- Inline parameters
- Middleware options

