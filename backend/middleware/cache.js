// Simple in-memory cache middleware for read-heavy operations
// For production, consider using Redis

class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100; // Maximum number of cached items
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  }

  set(key, value, ttl = this.defaultTTL) {
    // Implement LRU by removing oldest if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Delete all keys matching a pattern
  deletePattern(pattern) {
    const regex = new RegExp(pattern);
    const keysToDelete = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create a singleton cache instance
export const cache = new SimpleCache();

// Middleware to cache GET requests
export function cacheMiddleware(ttl = 5 * 60 * 1000) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`📦 Cache HIT: ${req.originalUrl}`);
      return res.json(cachedResponse);
    }

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Only cache successful responses
      if (res.statusCode === 200) {
        cache.set(key, data, ttl);
        console.log(`💾 Cache SET: ${req.originalUrl}`);
      }
      return originalJson(data);
    };

    next();
  };
}

// Middleware to invalidate cache for specific patterns on mutations
export function invalidateCacheMiddleware(patterns = []) {
  return (req, res, next) => {
    // Only invalidate on POST, PUT, DELETE, PATCH
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      patterns.forEach(pattern => {
        cache.deletePattern(pattern);
        console.log(`🗑️  Cache invalidated: ${pattern}`);
      });
    }
    next();
  };
}

