import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which transports the logger must use
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  }),
];

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Create logs directory if it doesn't exist
  const fs = require('fs');
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );

  // HTTP log file
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'http.log'),
      level: 'http',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

// Create the logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Custom log functions
export const logError = (error: Error, context?: any) => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, {
    meta,
    timestamp: new Date().toISOString()
  });
};

export const logWarning = (message: string, meta?: any) => {
  logger.warn(message, {
    meta,
    timestamp: new Date().toISOString()
  });
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, {
    meta,
    timestamp: new Date().toISOString()
  });
};

// Security logging
export const logSecurityEvent = (event: string, details: any) => {
  logger.warn('Security Event:', {
    event,
    details,
    timestamp: new Date().toISOString(),
    level: 'security'
  });
};

// Performance logging
export const logPerformance = (operation: string, duration: number, meta?: any) => {
  logger.info('Performance Metric:', {
    operation,
    duration: `${duration}ms`,
    meta,
    timestamp: new Date().toISOString(),
    level: 'performance'
  });
};

// Database logging
export const logDatabaseOperation = (operation: string, table: string, duration?: number) => {
  logger.debug('Database Operation:', {
    operation,
    table,
    duration: duration ? `${duration}ms` : undefined,
    timestamp: new Date().toISOString()
  });
};

// API logging
export const logAPIRequest = (method: string, url: string, statusCode: number, duration: number, ip: string) => {
  logger.http('API Request:', {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    ip,
    timestamp: new Date().toISOString()
  });
};

// User activity logging
export const logUserActivity = (userId: string, activity: string, details?: any) => {
  logger.info('User Activity:', {
    userId,
    activity,
    details,
    timestamp: new Date().toISOString()
  });
};

// System health logging
export const logSystemHealth = (component: string, status: 'healthy' | 'degraded' | 'unhealthy', details?: any) => {
  const level = status === 'healthy' ? 'info' : status === 'degraded' ? 'warn' : 'error';
  logger[level]('System Health:', {
    component,
    status,
    details,
    timestamp: new Date().toISOString()
  });
};

// Export default logger
export default logger;
