/**
 * Performance Optimization Middleware
 * Implements caching, request deduplication, and query optimization
 */

// Response cache
const responseCache = new Map();
const CACHE_DURATION = 60000; // 1 minute

/**
 * Cache middleware for GET requests
 */
export function cacheMiddleware(duration = CACHE_DURATION) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.method}:${req.originalUrl}`;
    const cached = responseCache.get(key);

    if (cached && Date.now() - cached.timestamp < duration) {
      console.log(`✅ Cache HIT: ${key}`);
      return res.json(cached.data);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function(data) {
      responseCache.set(key, {
        data,
        timestamp: Date.now(),
      });
      console.log(`💾 Cached: ${key}`);
      return originalJson(data);
    };

    next();
  };
}

/**
 * Clear cache for specific patterns
 */
export function clearCache(pattern) {
  let cleared = 0;
  for (const key of responseCache.keys()) {
    if (key.includes(pattern)) {
      responseCache.delete(key);
      cleared++;
    }
  }
  console.log(`🧹 Cleared ${cleared} cache entries matching: ${pattern}`);
}

/**
 * Request deduplication middleware
 */
const pendingRequests = new Map();

export function deduplicationMiddleware(req, res, next) {
  const key = `${req.method}:${req.originalUrl}`;

  // Only deduplicate GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // Check if request is already pending
  if (pendingRequests.has(key)) {
    console.log(`⏳ Deduplicating request: ${key}`);
    const pending = pendingRequests.get(key);
    
    // Wait for the pending request to complete
    pending.then(data => {
      res.json(data);
    }).catch(error => {
      res.status(500).json({ error: error.message });
    });
    
    return;
  }

  // Create promise for this request
  const promise = new Promise((resolve, reject) => {
    const originalJson = res.json.bind(res);
    const originalStatus = res.status.bind(res);
    
    let statusCode = 200;
    
    res.status = function(code) {
      statusCode = code;
      return originalStatus(code);
    };
    
    res.json = function(data) {
      if (statusCode === 200) {
        resolve(data);
      } else {
        reject(new Error(data.error || 'Request failed'));
      }
      pendingRequests.delete(key);
      return originalJson(data);
    };
  });

  pendingRequests.set(key, promise);
  next();
}

/**
 * Query optimization hints
 */
export function addQueryOptimizations(collection) {
  // Create indexes for common queries
  const indexes = [
    { userId: 1 },
    { userId: 1, isActive: 1 },
    { userId: 1, createdAt: -1 },
    { prn: 1 },
    { referralCode: 1 },
  ];

  indexes.forEach(index => {
    collection.createIndex(index, { background: true }).catch(err => {
      console.log('Index already exists or error:', err.message);
    });
  });
}

/**
 * Batch operation helper
 */
export async function batchOperation(items, operation, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => operation(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Performance monitoring middleware
 */
export function performanceMonitor(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.originalUrl} - ${duration}ms`);
    } else if (duration > 500) {
      console.log(`⏱️ ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
  });
  
  next();
}

/**
 * Clean up old cache entries
 */
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      responseCache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
  }
}, 60000); // Clean every minute
