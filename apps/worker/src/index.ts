import dotenv from 'dotenv';
dotenv.config();

import { evaluateBudgetThresholds } from './jobs/nudges';
import { Budget, Transaction } from '../../packages/types/src';

// Mock data for local dev
const budgets: Budget[] = [
  { id: 'b1', userId: 'u1', categoryId: 'c1', period: 'month', limit: 300, currency: 'EUR', startsOn: '2025-08-01' },
  { id: 'b2', userId: 'u1', categoryId: 'c2', period: 'month', limit: 120, currency: 'EUR', startsOn: '2025-08-01' },
];

const txs: Transaction[] = [
  { id: 't1', userId: 'u1', bankAccountId: 'a1', date: '2025-08-25', amount: 95, currency: 'EUR', description: 'Restaurant', merchant: 'Bistro', categoryId: 'c2' },
  { id: 't2', userId: 'u1', bankAccountId: 'a1', date: '2025-08-26', amount: 180, currency: 'EUR', description: 'Groceries', merchant: 'Supermarkt', categoryId: 'c1' },
];

function tick() {
  const alerts = evaluateBudgetThresholds(budgets, txs);
  if (alerts.length) {
    console.log(`[nudges] alerts:`, alerts);
  } else {
    console.log(`[nudges] no alerts`);
  }
}

console.log('Worker started. Evaluating nudges every 15s...');
setInterval(tick, 15000);

