import { Budget, Transaction } from '../../../packages/types/src';

export function evaluateBudgetThresholds(
  budgets: Budget[],
  transactions: Transaction[],
) {
  // Extremely simplified: sum per category and compare to limit
  const alerts: { categoryId: string; ratio: number }[] = [];
  for (const b of budgets) {
    const spent = transactions
      .filter((t) => t.categoryId === b.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
    const ratio = spent / b.limit;
    if (ratio >= 0.8) alerts.push({ categoryId: b.categoryId, ratio });
  }
  return alerts;
}

