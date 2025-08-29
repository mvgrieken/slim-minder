import { Express } from 'express';
import { prisma } from '../prisma';

export function registerHealthRoutes(app: Express) {
  // Basic health check
  app.get('/health', async (req, res) => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: 'connected',
          api: 'running'
        }
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
        services: {
          database: 'disconnected',
          api: 'running'
        }
      });
    }
  });

  // Detailed health check with more info
  app.get('/health/detailed', async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      const dbResponseTime = Date.now() - startTime;

      // Get basic stats
      const userCount = await prisma.user.count();
      const transactionCount = await prisma.transaction.count();
      const budgetCount = await prisma.budget.count();

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        services: {
          database: {
            status: 'connected',
            responseTime: `${dbResponseTime}ms`
          },
          api: {
            status: 'running',
            port: process.env.PORT || 4000
          }
        },
        stats: {
          users: userCount,
          transactions: transactionCount,
          budgets: budgetCount
        }
      });
    } catch (error) {
      console.error('Detailed health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        services: {
          database: 'disconnected',
          api: 'running'
        }
      });
    }
  });

  // Readiness probe for Kubernetes
  app.get('/ready', async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ready' });
    } catch (error) {
      res.status(503).json({ status: 'not ready' });
    }
  });

  // Liveness probe for Kubernetes
  app.get('/live', (req, res) => {
    res.json({ status: 'alive' });
  });
}

