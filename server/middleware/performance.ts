import compression from 'compression';
import { Request, Response, NextFunction } from 'express';
import { logger } from './logger.js';

// Compression middleware
export const compressionMiddleware = compression({
  filter: (req: Request, res: Response) => {
    // Don't compress if the request includes a Cache-Control: no-transform directive
    if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
      return false;
    }
    
    // Use compression for all other requests
    return compression.filter(req, res);
  },
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
});

// Response time middleware
export const responseTimeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Set response time header before response is sent
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${duration}ms`);
    return originalSend.call(this, body);
  };
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log performance metrics (without setting headers)
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: duration,
      contentLength: res.get('Content-Length') || 0,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        responseTime: duration,
        statusCode: res.statusCode
      });
    }
  });
  
  next();
};

// Cache control middleware
export const cacheControlMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Set cache headers based on route
  if (req.path.startsWith('/api/static/') || req.path.startsWith('/assets/')) {
    // Static assets - cache for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.path.startsWith('/api/health') || req.path.startsWith('/api/metrics')) {
    // Health checks - no cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else if (req.path.startsWith('/api/')) {
    // API responses - short cache
    res.setHeader('Cache-Control', 'private, max-age=300'); // 5 minutes
  } else {
    // Default - no cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  next();
};

// Request size limiter
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    logger.warn('Request size limit exceeded', {
      contentLength,
      maxSize,
      url: req.url,
      ip: req.ip
    });
    
    return res.status(413).json({
      error: 'Request entity too large',
      maxSize: '10MB'
    });
  }
  
  next();
};

// Connection limiter
export const connectionLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Simple connection limiting based on IP
  const ip = (req.ip || req.connection.remoteAddress || 'unknown') as string;
  const now = Date.now();
  
  // This is a simplified version - in production, use Redis or similar
  if (!global.connectionCounts) {
    global.connectionCounts = new Map();
  }
  
  const connections = global.connectionCounts.get(ip) || [];
  const recentConnections = connections.filter((time: number) => now - time < 60000); // Last minute
  
  if (recentConnections.length > 10) { // Max 10 connections per minute per IP
    logger.warn('Connection limit exceeded', {
      ip,
      connections: recentConnections.length,
      url: req.url
    });
    
    return res.status(429).json({
      error: 'Too many connections',
      retryAfter: 60
    });
  }
  
  recentConnections.push(now);
  global.connectionCounts.set(ip, recentConnections);
  
  next();
};

// Memory usage monitor
export const memoryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const memoryUsage = process.memoryUsage();
  const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
  
  // Log high memory usage
  if (memoryPercentage > 80) {
    logger.warn('High memory usage detected', {
      memoryPercentage: memoryPercentage.toFixed(2),
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      rss: memoryUsage.rss
    });
  }
  
  // Add memory info to response headers in development
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('X-Memory-Usage', `${memoryPercentage.toFixed(2)}%`);
    res.setHeader('X-Heap-Used', `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
  }
  
  next();
};

// Database query monitor
export const queryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Override res.json to monitor response time
  const originalJson = res.json;
  res.json = function(body: any) {
    const duration = Date.now() - startTime;
    
    // Log slow database operations
    if (duration > 500) {
      logger.warn('Slow database operation', {
        method: req.method,
        url: req.url,
        duration,
        statusCode: res.statusCode
      });
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// Performance metrics collector
export const performanceMetrics = {
  requests: 0,
  totalResponseTime: 0,
  slowRequests: 0,
  errors: 0,
  
  recordRequest(responseTime: number, statusCode: number) {
    performanceMetrics.requests++;
    performanceMetrics.totalResponseTime += responseTime;
    
    if (responseTime > 1000) {
      performanceMetrics.slowRequests++;
    }
    
    if (statusCode >= 400) {
      performanceMetrics.errors++;
    }
  },
  
  getMetrics() {
    return {
      requests: performanceMetrics.requests,
      averageResponseTime:
        performanceMetrics.requests > 0
          ? performanceMetrics.totalResponseTime / performanceMetrics.requests
          : 0,
      slowRequests: performanceMetrics.slowRequests,
      errors: performanceMetrics.errors,
      errorRate:
        performanceMetrics.requests > 0
          ? (performanceMetrics.errors / performanceMetrics.requests) * 100
          : 0,
    };
  },
  
  reset() {
    performanceMetrics.requests = 0;
    performanceMetrics.totalResponseTime = 0;
    performanceMetrics.slowRequests = 0;
    performanceMetrics.errors = 0;
  }
};

// Performance metrics middleware
export const performanceMetricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    performanceMetrics.recordRequest(duration, res.statusCode);
  });
  
  next();
};

// Global performance monitoring
declare global {
  var connectionCounts: Map<string, number[]>;
}
