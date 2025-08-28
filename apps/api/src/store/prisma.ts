import { prisma } from '../prisma';
import type { Store, User, Category, Budget, Transaction, ID } from './types';

export const prismaStore: Store = {
  async createGuest() {
    const u = await prisma.user.create({ data: {} });
    // Seed default categories for new users (idempotent per new user)
    const defaults = ['Boodschappen', 'Uit eten', 'Vervoer', 'Abonnementen', 'Overig'];
    await prisma.category.createMany({ data: defaults.map(name => ({ userId: u.id, name })), skipDuplicates: true });
    return { id: u.id, createdAt: u.createdAt.toISOString() };
  },
  async getUser(id) {
    const u = await prisma.user.findUnique({ where: { id } });
    return u ? { id: u.id, createdAt: u.createdAt.toISOString() } : null;
  },

  async listCategories(userId) {
    const list = await prisma.category.findMany({ where: { userId, archived: false }, orderBy: { createdAt: 'asc' } });
    return list.map(c => ({ id: c.id, userId: c.userId, name: c.name, icon: c.icon || undefined, archived: c.archived, createdAt: c.createdAt.toISOString() } satisfies Category));
  },
  async createCategory(userId, input) {
    const c = await prisma.category.create({ data: { userId, name: input.name || 'Nieuwe categorie', icon: input.icon } });
    return { id: c.id, userId: c.userId, name: c.name, icon: c.icon || undefined, archived: c.archived, createdAt: c.createdAt.toISOString() };
  },
  async updateCategory(userId, id, patch) {
    const c = await prisma.category.update({ where: { id }, data: { name: patch.name, icon: patch.icon, archived: patch.archived } }).catch(() => null);
    return c ? { id: c.id, userId: c.userId, name: c.name, icon: c.icon || undefined, archived: c.archived, createdAt: c.createdAt.toISOString() } : null;
  },
  async deleteCategory(_userId, id) { await prisma.category.delete({ where: { id } }).catch(() => {}); },

  async listBudgets(userId) {
    const list = await prisma.budget.findMany({ where: { userId }, orderBy: { startsOn: 'desc' } });
    return list.map(b => ({ id: b.id, userId: b.userId, categoryId: b.categoryId, period: 'month', limit: Number(b.limit), currency: b.currency, startsOn: b.startsOn.toISOString().slice(0,10), active: b.active } satisfies Budget));
  },
  async createBudget(userId, input) {
    const b = await prisma.budget.create({ data: { userId, categoryId: input.categoryId, period: 'month', limit: input.limit, currency: input.currency, startsOn: new Date(input.startsOn), active: input.active ?? true } });
    return { id: b.id, userId: b.userId, categoryId: b.categoryId, period: 'month', limit: Number(b.limit), currency: b.currency, startsOn: b.startsOn.toISOString().slice(0,10), active: b.active };
  },
  async updateBudget(_userId, id, patch) {
    const b = await prisma.budget.update({ where: { id }, data: { limit: patch.limit, currency: patch.currency, startsOn: patch.startsOn ? new Date(patch.startsOn) : undefined, active: patch.active } }).catch(() => null);
    return b ? { id: b.id, userId: b.userId, categoryId: b.categoryId, period: 'month', limit: Number(b.limit), currency: b.currency, startsOn: b.startsOn.toISOString().slice(0,10), active: b.active } : null;
  },
  async deleteBudget(_userId, id) { await prisma.budget.delete({ where: { id } }).catch(() => {}); },

  async listTransactions(userId, filters) {
    const list = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: filters?.from ? new Date(filters.from) : undefined,
          lte: filters?.to ? new Date(filters.to) : undefined,
        },
        categoryId: filters?.categoryId,
      },
      orderBy: { date: 'desc' }
    });
    return list.map(t => ({ id: t.id, userId: t.userId, bankAccountId: t.bankAccountId ?? null, date: t.date.toISOString(), amount: Number(t.amount), currency: t.currency, description: t.description ?? undefined, merchant: t.merchant ?? undefined, categoryId: t.categoryId ?? null, createdAt: t.createdAt.toISOString() } satisfies Transaction));
  },
  async createTransaction(userId, input) {
    const t = await prisma.transaction.create({ data: { userId, bankAccountId: input.bankAccountId ?? null, date: new Date(input.date), amount: input.amount, currency: input.currency, description: input.description, merchant: input.merchant, categoryId: input.categoryId ?? null } });
    return { id: t.id, userId: t.userId, bankAccountId: t.bankAccountId ?? null, date: t.date.toISOString(), amount: Number(t.amount), currency: t.currency, description: t.description ?? undefined, merchant: t.merchant ?? undefined, categoryId: t.categoryId ?? null, createdAt: t.createdAt.toISOString() };
  },
  async updateTransaction(_userId, id, patch) {
    const t = await prisma.transaction.update({ where: { id }, data: {
      bankAccountId: patch.bankAccountId ?? undefined,
      date: patch.date ? new Date(patch.date) : undefined,
      amount: patch.amount,
      currency: patch.currency,
      description: patch.description,
      merchant: patch.merchant,
      categoryId: patch.categoryId ?? undefined,
    } }).catch(() => null);
    return t ? { id: t.id, userId: t.userId, bankAccountId: t.bankAccountId ?? null, date: t.date.toISOString(), amount: Number(t.amount), currency: t.currency, description: t.description ?? undefined, merchant: t.merchant ?? undefined, categoryId: t.categoryId ?? null, createdAt: t.createdAt.toISOString() } : null;
  },
  async deleteTransaction(_userId, id) { await prisma.transaction.delete({ where: { id } }).catch(() => {}); },
};
