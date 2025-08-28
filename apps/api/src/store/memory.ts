import { randomUUID } from 'crypto';
import type { Store, User, Category, Budget, Transaction, ID } from './types';

const users = new Map<ID, User>();
const categories = new Map<ID, Category[]>();
const budgets = new Map<ID, Budget[]>();
const txs = new Map<ID, Transaction[]>();

export const memoryStore: Store = {
  async createGuest() {
    const id = randomUUID();
    const user = { id, createdAt: new Date().toISOString() };
    users.set(id, user);
    return user;
  },
  async getUser(id) { return users.get(id) || null; },

  async listCategories(userId) { return categories.get(userId) || []; },
  async createCategory(userId, input) {
    const list = categories.get(userId) || [];
    const now = new Date().toISOString();
    const cat: Category = { id: randomUUID(), userId, name: input.name || 'Nieuwe categorie', icon: input.icon, archived: false, createdAt: now };
    list.push(cat);
    categories.set(userId, list);
    return cat;
  },
  async updateCategory(userId, id, patch) {
    const list = categories.get(userId) || [];
    const idx = list.findIndex(c => c.id === id);
    if (idx < 0) return null;
    const next = { ...list[idx], ...patch } as Category;
    list[idx] = next;
    categories.set(userId, list);
    return next;
  },
  async deleteCategory(userId, id) {
    const list = categories.get(userId) || [];
    categories.set(userId, list.filter(c => c.id !== id));
  },

  async listBudgets(userId) { return budgets.get(userId) || []; },
  async createBudget(userId, input) {
    const list = budgets.get(userId) || [];
    const b: Budget = { id: randomUUID(), userId, active: input.active ?? true, ...input } as Budget;
    list.push(b);
    budgets.set(userId, list);
    return b;
  },
  async updateBudget(userId, id, patch) {
    const list = budgets.get(userId) || [];
    const idx = list.findIndex(c => c.id === id);
    if (idx < 0) return null;
    const next = { ...list[idx], ...patch } as Budget;
    list[idx] = next;
    budgets.set(userId, list);
    return next;
  },
  async deleteBudget(userId, id) {
    const list = budgets.get(userId) || [];
    budgets.set(userId, list.filter(c => c.id !== id));
  },

  async listTransactions(userId, filters) {
    const list = txs.get(userId) || [];
    const from = filters?.from ? new Date(filters.from) : undefined;
    const to = filters?.to ? new Date(filters.to) : undefined;
    const categoryId = filters?.categoryId;
    return list.filter(t => {
      const d = new Date(t.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (categoryId && t.categoryId !== categoryId) return false;
      return true;
    });
  },
  async createTransaction(userId, input) {
    const list = txs.get(userId) || [];
    const now = new Date().toISOString();
    const t: Transaction = { id: randomUUID(), userId, createdAt: now, ...input };
    list.unshift(t);
    txs.set(userId, list);
    return t;
  },
  async updateTransaction(userId, id, patch) {
    const list = txs.get(userId) || [];
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return null;
    const next = { ...list[idx], ...patch } as Transaction;
    list[idx] = next;
    txs.set(userId, list);
    return next;
  },
  async deleteTransaction(userId, id) {
    const list = txs.get(userId) || [];
    txs.set(userId, list.filter(t => t.id !== id));
  },
};

