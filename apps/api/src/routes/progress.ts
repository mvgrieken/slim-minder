import { Express, Request, Response } from 'express';
import { store } from '../store';

function uid(req: Request) { return req.userId || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerProgressRoutes(app: Express) {
  app.get('/progress/budgets', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });
      const qsStart = String(req.query.periodStart || '').trim();
      const today = new Date();
      const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      const periodStart = qsStart || defaultStart;

      const [budgets, cats] = await Promise.all([
        store.listBudgets(userId),
        store.listCategories(userId),
      ]);
      const startMonth = periodStart.slice(0, 7);
      const filteredBudgets = budgets.filter(b => (b.startsOn || '').slice(0, 7) === startMonth && b.active !== false);
      const categoryIds = filteredBudgets.map(b => b.categoryId);
      
      const txs = categoryIds.length > 0 
        ? await store.listTransactions(userId, { from: periodStart, categoryIds })
        : [];
      
      const nameByCat = new Map(cats.map(c => [c.id, c.name] as const));
      const spentByCategory = new Map<string, number>();
      
      txs.forEach(t => {
        if (t.categoryId) {
          spentByCategory.set(t.categoryId, (spentByCategory.get(t.categoryId) || 0) + t.amount);
        }
      });
      
      const out = filteredBudgets.map(b => {
        const spent = spentByCategory.get(b.categoryId) || 0;
        const ratio = b.limit > 0 ? spent / b.limit : 0;
        return { budgetId: b.id, categoryId: b.categoryId, categoryName: nameByCat.get(b.categoryId) || null, currency: b.currency, spent, limit: b.limit, ratio };
      });
      res.json(out);
    } catch (e) {
      res.status(500).json({ error: 'progress_failed', detail: String(e) });
    }
  });
}
