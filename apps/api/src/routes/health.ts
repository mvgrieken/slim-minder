import express from 'express';
import { store } from '../store';

const router = express.Router();
  // Basic health check
  router.get('/health', async (req, res) => {
    try {
      // Check store connection (works with both memory and database)
      const testUser = await store.createGuest();
      
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
        error: 'Store connection failed',
        services: {
          database: 'disconnected',
          api: 'running'
        }
      });
    }
  });

  // Detailed health check with more info
  router.get('/health/detailed', async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Check store connection (works with both memory and database)
      const testUser = await store.createGuest();
      const dbResponseTime = Date.now() - startTime;

      // Get basic stats (mock for memory store)
      const userCount = 1; // Mock count for memory store
      const transactionCount = 0; // Mock count for memory store
      const budgetCount = 0; // Mock count for memory store

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
  router.get('/ready', async (req, res) => {
    try {
      await store.createGuest();
      res.json({ status: 'ready' });
    } catch (error) {
      res.status(503).json({ status: 'not ready' });
    }
  });

  // Liveness probe for Kubernetes
  router.get('/live', (req, res) => {
    res.json({ status: 'alive' });
  });

export default router;

