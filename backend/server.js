import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectToDatabase, checkDatabaseHealth } from './config/database.js';
import { requestLogger, errorLogger, logger } from './middleware/logger.js';
import { cacheMiddleware, invalidateCacheMiddleware, cache } from './middleware/cache.js';
import usersRouter from './routes/users.js';
import profilesRouter from './routes/profiles.js';
import loginsRouter from './routes/logins.js';
import pendingRegistrationsRouter from './routes/pendingRegistrations.js';
import quizRouter from './routes/quiz.js';
import leaderboardRouter from './routes/leaderboard.js';
import authRouter from './routes/auth.js';
import { initializeDefaultAdmin } from './models/Admin.js';
import { getDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: IS_PRODUCTION ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later.',
});
app.use('/api/auth/', authLimiter);
app.use('/api/users/register', authLimiter);

// ============================================================================
// PERFORMANCE MIDDLEWARE
// ============================================================================

// Response compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (0-9)
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (only in development)
if (!IS_PRODUCTION) {
  app.use(requestLogger);
}

// ============================================================================
// HEALTH CHECK & MONITORING
// ============================================================================

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Geeta Olympiad API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Detailed health check
app.get('/health/detailed', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    const cacheStats = cache.getStats();
    
    res.status(200).json({
      status: dbHealth.healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
      database: {
        healthy: dbHealth.healthy,
        message: dbHealth.message,
      },
      cache: {
        size: cacheStats.size,
        maxSize: cacheStats.maxSize,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// Cache statistics endpoint (development only)
if (!IS_PRODUCTION) {
  app.get('/cache/stats', (req, res) => {
    res.json(cache.getStats());
  });

  app.delete('/cache/clear', (req, res) => {
    cache.clear();
    res.json({ message: 'Cache cleared successfully' });
  });
}

// ============================================================================
// API ROUTES WITH CACHING
// ============================================================================

// Users routes - invalidate cache on mutations
app.use('/api/users', 
  invalidateCacheMiddleware(['cache:/api/users/', 'cache:/api/profiles/']),
  usersRouter
);

// Profiles routes - with caching for GET requests
app.use('/api/profiles', 
  cacheMiddleware(3 * 60 * 1000), // Cache for 3 minutes
  invalidateCacheMiddleware(['cache:/api/profiles/', 'cache:/api/leaderboard/']),
  profilesRouter
);

// Logins routes
app.use('/api/logins', loginsRouter);

// Pending registrations routes
app.use('/api/pending-registrations', pendingRegistrationsRouter);

// Quiz routes - with caching
app.use('/api/quiz', 
  cacheMiddleware(5 * 60 * 1000), // Cache for 5 minutes
  invalidateCacheMiddleware(['cache:/api/quiz/']),
  quizRouter
);

// Leaderboard routes - with aggressive caching
app.use('/api/leaderboard', 
  cacheMiddleware(10 * 60 * 1000), // Cache for 10 minutes
  leaderboardRouter
);

// Auth routes - no caching, strict rate limiting
app.use('/api/auth', authRouter);

// ============================================================================
// ERROR HANDLERS
// ============================================================================

// 404 handler
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Error logging middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = IS_PRODUCTION && status === 500 
    ? 'Internal server error' 
    : err.message;

  logger.error(`${status} Error: ${message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  res.status(status).json({ 
    error: message,
    ...((!IS_PRODUCTION) && { stack: err.stack }),
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    logger.info('🚀 Starting Geeta Olympiad Backend...');
    logger.info(`📍 Environment: ${NODE_ENV}`);
    logger.info(`📍 Port: ${PORT}`);

    // Connect to MongoDB with retry logic
    let retries = 5;
    while (retries > 0) {
      try {
        await connectToDatabase();
        logger.info('✅ MongoDB connection established');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        logger.warn(`MongoDB connection failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Initialize default admin if needed
    const db = await getDatabase();
    await initializeDefaultAdmin(db);
    logger.info('✅ Admin initialization complete');

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 Detailed health: http://localhost:${PORT}/health/detailed`);
      console.log(`\n✨ Backend is ready! Environment: ${NODE_ENV}\n`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`\n⚠️  ${signal} received, shutting down gracefully...`);
      
      server.close(() => {
        logger.info('✅ HTTP server closed');
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('❌ Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle port in use error
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use!`);
        console.error(`\n❌ Error: Port ${PORT} is already in use!`);
        console.error('To fix this:');
        console.error(`1. Kill the process: netstat -ano | findstr :${PORT}`);
        console.error('2. Or set a different PORT in your .env file\n');
        process.exit(1);
      } else {
        logger.error('Server error', { error: error.message, stack: error.stack });
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      shutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { reason, promise });
    });

  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
