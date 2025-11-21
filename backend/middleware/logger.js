// Request logging middleware

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

// Simple logger
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
    this.errorFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
  }

  writeToFile(file, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    fs.appendFile(file, logMessage, (err) => {
      if (err) console.error('Failed to write to log file:', err);
    });
  }

  log(level, message, data = null) {
    const logData = data ? ` | Data: ${JSON.stringify(data)}` : '';
    const fullMessage = `[${level}] ${message}${logData}`;
    
    // Always console log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(fullMessage);
    }
    
    // Write to file
    this.writeToFile(this.logFile, fullMessage);
    
    // Also write errors to error file
    if (level === LOG_LEVELS.ERROR) {
      this.writeToFile(this.errorFile, fullMessage);
    }
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  debug(message, data) {
    if (process.env.NODE_ENV !== 'production') {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
  }
}

export const logger = new Logger();

// Request logging middleware
export function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // Log request
  logger.info(`→ ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    logger.info(`← ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      status: res.statusCode,
      duration: `${duration}ms`,
    });
    
    originalSend.call(this, data);
  };

  next();
}

// Error logging middleware
export function errorLogger(err, req, res, next) {
  logger.error(`Error on ${req.method} ${req.originalUrl}`, {
    error: err.message,
    stack: err.stack,
    body: req.body,
  });
  
  next(err);
}

