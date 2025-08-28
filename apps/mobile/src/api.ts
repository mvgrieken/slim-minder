const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

export type Guest = { id: string };

import { getAccessToken } from './supabase';

async function request(path: string, options: RequestInit = {}, userId?: string) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = await getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else if (userId) {
    // Dev fallback
    headers.set('x-sm-user-id', userId);
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return null;
}

export async function health() {
  return request('/health');
}

export async function createGuest(): Promise<Guest> {
  return request('/users/guest', { method: 'POST' });
}

export type Budget = { id: string; categoryId: string; limit: number; currency: string; startsOn: string; active: boolean };
export async function listBudgets(userId: string): Promise<Budget[]> {
  return request('/budgets', {}, userId);
}

export type BudgetProgress = { budgetId: string; categoryId: string; categoryName: string | null; currency: string; spent: number; limit: number; ratio: number };
export async function budgetsProgress(userId: string, periodStart: string): Promise<BudgetProgress[]> {
  const qs = new URLSearchParams({ periodStart }).toString();
  return request(`/progress/budgets?${qs}`, {}, userId);
}

// Categories
export type Category = { id: string; userId: string; name: string; icon?: string; archived: boolean; createdAt: string };
export async function listCategories(userId: string): Promise<Category[]> {
  return request('/categories', {}, userId);
}
export async function createCategory(userId: string, name: string, icon?: string): Promise<Category> {
  return request('/categories', { method: 'POST', body: JSON.stringify({ name, icon }) }, userId);
}
export async function updateCategory(userId: string, id: string, patch: Partial<Pick<Category, 'name'|'icon'|'archived'>>): Promise<Category> {
  return request(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }, userId);
}
export async function deleteCategory(userId: string, id: string): Promise<void> {
  await request(`/categories/${id}`, { method: 'DELETE' }, userId);
}

// Budgets CRUD
export async function createBudget(userId: string, input: { categoryId: string; limit: number; currency: string; startsOn: string; active?: boolean }): Promise<Budget> {
  return request('/budgets', { method: 'POST', body: JSON.stringify(input) }, userId);
}
export async function updateBudget(userId: string, id: string, patch: Partial<Pick<Budget, 'limit'|'currency'|'startsOn'|'active'>>): Promise<Budget> {
  return request(`/budgets/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }, userId);
}
export async function deleteBudget(userId: string, id: string): Promise<void> {
  await request(`/budgets/${id}`, { method: 'DELETE' }, userId);
}

// Transactions
export type Transaction = { id: string; userId: string; date: string; amount: number; currency: string; description?: string; merchant?: string; categoryId?: string | null; createdAt: string };
export async function listTransactions(userId: string, params?: { from?: string; to?: string; categoryId?: string }): Promise<Transaction[]> {
  const qs = new URLSearchParams();
  if (params?.from) qs.set('from', params.from);
  if (params?.to) qs.set('to', params.to);
  if (params?.categoryId) qs.set('categoryId', params.categoryId);
  const path = qs.toString() ? `/transactions?${qs.toString()}` : '/transactions';
  return request(path, {}, userId);
}
export async function createTransaction(userId: string, input: { amount: number; currency: string; date: string; categoryId?: string | null; description?: string; merchant?: string }): Promise<Transaction> {
  return request('/transactions', { method: 'POST', body: JSON.stringify(input) }, userId);
}
export async function updateTransaction(userId: string, id: string, patch: Partial<Omit<Transaction, 'id'|'userId'|'createdAt'>>): Promise<Transaction> {
  return request(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }, userId);
}
export async function deleteTransaction(userId: string, id: string): Promise<void> {
  await request(`/transactions/${id}`, { method: 'DELETE' }, userId);
}
