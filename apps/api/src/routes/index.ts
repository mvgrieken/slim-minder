import { Express } from 'express';
import { registerHealthRoutes } from './health';
import { registerUserRoutes } from './users';
import { registerCategoryRoutes } from './categories';
import { registerBudgetRoutes } from './budgets';
import { registerTransactionRoutes } from './transactions';
import { registerProgressRoutes } from './progress';
import { registerBankRoutes } from './bank-express';
import { registerAIRoutes } from './ai-express';

export function registerRoutes(app: Express) {
  registerHealthRoutes(app);
  registerUserRoutes(app);
  registerCategoryRoutes(app);
  registerBudgetRoutes(app);
  registerTransactionRoutes(app);
  registerProgressRoutes(app);
  registerBankRoutes(app);
  registerAIRoutes(app);
}
