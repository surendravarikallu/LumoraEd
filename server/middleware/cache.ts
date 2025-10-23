import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

// Simple in-memory cache (for development)
// In production, use Redis
class MemoryCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  
  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}

const memoryCache = new MemoryCache();

// Cache middleware
export const cacheMiddleware = (ttl: number = 300000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Generate cache key
    const cacheKey = `${req.method}:${req.originalUrl}:${req.query ? JSON.stringify(req.query) : ''}`;
    
    // Check cache
    const cachedData = memoryCache.get(cacheKey);
    if (cachedData) {
      logger.debug('Cache hit', { key: cacheKey });
      return res.json(cachedData);
    }
    
    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function(body: any) {
      // Only cache successful responses
      if (res.statusCode === 200) {
        memoryCache.set(cacheKey, body, ttl);
        logger.debug('Cache set', { key: cacheKey, ttl });
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
};

// Cache invalidation middleware
export const cacheInvalidation = (pattern: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Override res.json to invalidate cache
    const originalJson = res.json;
    res.json = function(body: any) {
      // Invalidate cache after successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // This is a simplified version - in production, use Redis pattern matching
        memoryCache.clear();
        logger.debug('Cache invalidated', { pattern });
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
};

// Cache statistics
export const cacheStats = (req: Request, res: Response) => {
  res.json({
    size: memoryCache.size(),
    timestamp: new Date().toISOString()
  });
};

// Clear cache endpoint
export const clearCache = (req: Request, res: Response) => {
  memoryCache.clear();
  logger.info('Cache cleared manually');
  res.json({ message: 'Cache cleared successfully' });
};

// Cache for specific routes
export const userCache = cacheMiddleware(600000); // 10 minutes
export const challengeCache = cacheMiddleware(300000); // 5 minutes
export const roadmapCache = cacheMiddleware(900000); // 15 minutes
export const certificationCache = cacheMiddleware(1800000); // 30 minutes

// Cache invalidation for specific operations
export const invalidateUserCache = cacheInvalidation('user');
export const invalidateChallengeCache = cacheInvalidation('challenge');
export const invalidateRoadmapCache = cacheInvalidation('roadmap');
