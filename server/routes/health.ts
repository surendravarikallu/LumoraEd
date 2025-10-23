import { Request, Response } from 'express';
import { storage } from '../storage';
import { logger } from '../middleware/logger';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error';
      responseTime?: number;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    disk: {
      used: number;
      total: number;
      percentage: number;
    };
  };
}

// Basic health check
export const healthCheck = async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const dbStartTime = Date.now();
    await storage.getAllUsers();
    const dbResponseTime = Date.now() - dbStartTime;
    
    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;
    
    // Get disk usage (simplified)
    const diskUsage = {
      used: 0, // This would need a proper disk usage library
      total: 0,
      percentage: 0
    };
    
    const health: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: 'connected',
          responseTime: dbResponseTime
        },
        memory: {
          used: usedMemory,
          total: totalMemory,
          percentage: memoryPercentage
        },
        disk: diskUsage
      }
    };
    
    // Log health check
    logger.info('Health check performed', {
      status: health.status,
      responseTime: Date.now() - startTime,
      databaseResponseTime: dbResponseTime,
      memoryUsage: memoryPercentage
    });
    
    res.status(200).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    
    const health: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: 'error'
        },
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
          percentage: 0
        },
        disk: {
          used: 0,
          total: 0,
          percentage: 0
        }
      }
    };
    
    res.status(503).json(health);
  }
};

// Detailed health check
export const detailedHealthCheck = async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    // Database health
    const dbStartTime = Date.now();
    const userCount = await storage.getAllUsers();
    const dbResponseTime = Date.now() - dbStartTime;
    
    // Memory health
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;
    
    // CPU usage (simplified)
    const cpuUsage = process.cpuUsage();
    
    // System info
    const systemInfo = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime()
    };
    
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: systemInfo,
      services: {
        database: {
          status: 'connected',
          responseTime: dbResponseTime,
          userCount: userCount.length
        },
        memory: {
          used: usedMemory,
          total: totalMemory,
          percentage: memoryPercentage,
          external: memoryUsage.external,
          rss: memoryUsage.rss
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system
        }
      },
      performance: {
        responseTime: Date.now() - startTime,
        databaseResponseTime: dbResponseTime
      }
    };
    
    logger.info('Detailed health check performed', detailedHealth);
    
    res.status(200).json(detailedHealth);
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

// Readiness check
export const readinessCheck = async (req: Request, res: Response) => {
  try {
    // Check if all required services are ready
    await storage.getAllUsers();
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({
      status: 'not ready',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

// Liveness check
export const livenessCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

// Metrics endpoint
export const metrics = (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    process: {
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
  
  res.status(200).json(metrics);
};
