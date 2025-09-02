import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import { registerBankRoutes } from './bank-express';
import { registerAIRoutes } from './ai-express';
import transactionsRouter from './transactions-express';
import budgetsRouter from './budgets-express';

export function registerRoutes(router: Router) {
  // Health check
  router.use('/health', healthRouter);
  
  // User management
  router.use('/users', usersRouter);
  
  // Bank integration
  registerBankRoutes(router);
  
  // AI coach
  registerAIRoutes(router);
  
  // Transactions
  router.use('/transactions', transactionsRouter);
  
  // Budgets
  router.use('/budgets', budgetsRouter);
}
