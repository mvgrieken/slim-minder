import { Router } from 'express';
import { registerHealthRoutes } from './health';
import { registerUserRoutes } from './users';
import { registerCategoryRoutes } from './categories';
import { registerBudgetRoutes } from './budgets';
import { registerTransactionRoutes } from './transactions';
import { registerProgressRoutes } from './progress';
import { registerBankRoutes } from './bank-express';
import { registerAIRoutes } from './ai-express';

export function registerRoutes(router: Router) {
  registerHealthRoutes(router);
  registerUserRoutes(router);
  registerCategoryRoutes(router);
  registerBudgetRoutes(router);
  registerTransactionRoutes(router);
  registerProgressRoutes(router);
  registerBankRoutes(router);
  registerAIRoutes(router);
}
