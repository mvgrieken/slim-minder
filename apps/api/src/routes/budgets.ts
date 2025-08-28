import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { store } from '../store';

const BudgetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categoryId: z.string(),
  period: z.literal('month'),
  limit: z.number(),
  currency: z.string(),
  startsOn: z.string(),
  active: z.boolean().default(true),
});

type Budget = z.infer<typeof BudgetSchema>;
const CreateBudgetInput = z.object({
  categoryId: z.string().trim().min(1),
  period: z.literal('month').optional(),
  limit: z.coerce.number().positive(),
  currency: z.string().trim().min(1),
  startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  active: z.boolean().optional(),
});
const UpdateBudgetPatch = z.object({
  limit: z.coerce.number().positive().optional(),
  currency: z.string().trim().min(1).optional(),
  startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  active: z.boolean().optional(),
});

function uid(req: Request) { return req.userId || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerBudgetRoutes(app: Express) {
  app.get('/budgets', (req: Request, res: Response) => {
    const id = uid(req);
    store.listBudgets(id).then((list) => res.json(list)).catch((e) => res.status(500).json({ error: 'list_failed', detail: String(e) }));
  });

  app.post('/budgets', (req: Request, res: Response) => {
    const id = uid(req);
    if (!id) return res.status(401).json({ error: 'missing_user' });
    const parsed = CreateBudgetInput.safeParse({ ...req.body, period: 'month' });
    if (!parsed.success) return res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    store.createBudget(id, parsed.data as any).then((b) => res.status(201).json(b)).catch((e) => res.status(500).json({ error: 'create_failed', detail: String(e) }));
  });

  app.patch('/budgets/:id', (req: Request, res: Response) => {
    const user = uid(req);
    const parsed = UpdateBudgetPatch.safeParse(req.body || {});
    if (!parsed.success) return res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    store.updateBudget(user, req.params.id, parsed.data).then((b) => {
      if (!b) return res.status(404).json({ error: 'not_found' });
      res.json(b);
    }).catch((e) => res.status(500).json({ error: 'update_failed', detail: String(e) }));
  });

  app.delete('/budgets/:id', (req: Request, res: Response) => {
    const user = uid(req);
    store.deleteBudget(user, req.params.id).then(() => res.status(204).send()).catch((e) => res.status(500).json({ error: 'delete_failed', detail: String(e) }));
  });
}
