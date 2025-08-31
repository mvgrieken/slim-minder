import { randomUUID } from 'crypto';
import type { Store, User, Category, Budget, Transaction, ID } from './types';

const users = new Map<ID, User>();
const categories = new Map<ID, Category[]>();
const budgets = new Map<ID, Budget[]>();
const txs = new Map<ID, Transaction[]>();
const bankAccounts = new Map<ID, any[]>();
const chatInteractions = new Map<ID, any[]>();

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

  // Bank functionality for development/testing
  async listBankAccounts(userId) {
    const accounts = bankAccounts.get(userId) || [];
    if (accounts.length === 0) {
      // Create mock account for development
      const mockAccount = {
        id: 'mock-account-1',
        userId,
        provider: 'tink',
        providerAccountId: 'mock-provider-id',
        iban: 'NL91ABNA0417164300',
        displayName: 'ING Bank - Hoofdrekening',
        currency: 'EUR',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      accounts.push(mockAccount);
      bankAccounts.set(userId, accounts);
    }
    return accounts;
  },

  async createBankAccount(userId, input) {
    const accounts = bankAccounts.get(userId) || [];
    const account = {
      id: randomUUID(),
      userId,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    accounts.push(account);
    bankAccounts.set(userId, accounts);
    return account;
  },

  async deleteBankAccount(userId, id) {
    const accounts = bankAccounts.get(userId) || [];
    bankAccounts.set(userId, accounts.filter(a => a.id !== id));
  },

  // AI functionality for development/testing
  async createChatInteraction(userId, input) {
    const interactions = chatInteractions.get(userId) || [];
    const interaction = {
      id: randomUUID(),
      userId,
      ...input,
      createdAt: new Date().toISOString()
    };
    interactions.push(interaction);
    chatInteractions.set(userId, interactions);
    return interaction;
  },

  async listChatInteractions(userId, filters) {
    const interactions = chatInteractions.get(userId) || [];
    const limit = filters?.limit || 20;
    const before = filters?.before ? new Date(filters.before) : undefined;
    
    let filtered = interactions;
    if (before) {
      filtered = filtered.filter(i => new Date(i.createdAt) < before);
    }
    
    return filtered.slice(-limit);
  },

  async updateChatInteraction(userId, id, patch) {
    const interactions = chatInteractions.get(userId) || [];
    const idx = interactions.findIndex(i => i.id === id);
    if (idx < 0) return null;
    const next = { ...interactions[idx], ...patch, updatedAt: new Date().toISOString() };
    interactions[idx] = next;
    chatInteractions.set(userId, interactions);
    return next;
  }
};

