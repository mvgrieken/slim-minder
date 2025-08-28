export type UUID = string;

export interface User {
  id: UUID;
  email: string;
  createdAt: string;
}

export interface BankAccount {
  id: UUID;
  provider: 'tink' | 'gocardless' | 'nordigen' | 'budget-insight' | 'mock';
  providerAccountId: string;
  userId: UUID;
  iban?: string;
  displayName?: string;
  currency: string;
  createdAt: string;
}

export interface Transaction {
  id: UUID;
  userId: UUID;
  bankAccountId: UUID;
  date: string; // ISO date
  amount: number; // positive = expense, negative = income (or vice versa depending on convention)
  currency: string; // e.g. EUR
  description?: string;
  merchant?: string;
  categoryId?: UUID;
  raw?: Record<string, unknown>;
}

export interface Category {
  id: UUID;
  userId: UUID;
  name: string; // e.g. Boodschappen, Vervoer
  icon?: string;
}

export interface Budget {
  id: UUID;
  userId: UUID;
  categoryId: UUID;
  period: 'month';
  limit: number; // e.g. 300
  currency: string; // e.g. EUR
  startsOn: string; // ISO date of period start
}

export interface Goal {
  id: UUID;
  userId: UUID;
  title: string;
  targetAmount: number;
  currency: string;
  deadline?: string; // ISO date
  createdAt: string;
}

export interface NudgeRule {
  id: UUID;
  userId: UUID;
  type: 'budget_threshold' | 'unusual_spend' | 'subscription_alert';
  params: Record<string, unknown>;
  active: boolean;
}

export interface Notification {
  id: UUID;
  userId: UUID;
  title: string;
  body: string;
  createdAt: string;
  readAt?: string;
}

export interface Badge {
  id: UUID;
  userId: UUID;
  name: string; // e.g. "Budget Held!"
  earnedAt: string;
}

