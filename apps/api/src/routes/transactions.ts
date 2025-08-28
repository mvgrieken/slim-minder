import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { store } from '../store';

const TxSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bankAccountId: z.string().nullable().optional(),
  date: z.string(),
  amount: z.number(),
  currency: z.string(),
  description: z.string().optional(),
  merchant: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  createdAt: z.string(),
});

type Tx = z.infer<typeof TxSchema>;
const CreateTxInput = z.object({
  amount: z.coerce.number().refine((n) => Number.isFinite(n) && Math.abs(n) > 0, 'invalid_amount'),
  currency: z.string().trim().min(1),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'invalid_date'),
  description: z.string().optional(),
  merchant: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  bankAccountId: z.string().optional().nullable(),
});
const UpdateTxPatch = z.object({
  amount: z.coerce.number().refine((n) => Number.isFinite(n) && Math.abs(n) > 0, 'invalid_amount').optional(),
  currency: z.string().trim().min(1).optional(),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), 'invalid_date').optional(),
  description: z.string().optional(),
  merchant: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  bankAccountId: z.string().optional().nullable(),
});

function uid(req: Request) { return req.userId || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerTransactionRoutes(app: Express) {
  app.get('/transactions', (req: Request, res: Response) => {
    const user = uid(req);
    const filters = { from: req.query.from ? String(req.query.from) : undefined, to: req.query.to ? String(req.query.to) : undefined, categoryId: req.query.categoryId ? String(req.query.categoryId) : undefined };
    store.listTransactions(user, filters).then((list) => res.json(list)).catch((e) => res.status(500).json({ error: 'list_failed', detail: String(e) }));
  });

  app.post('/transactions', (req: Request, res: Response) => {
    const user = uid(req);
    if (!user) return res.status(401).json({ error: 'missing_user' });
    const now = new Date().toISOString();
    const parsed = CreateTxInput.safeParse({ createdAt: now, bankAccountId: null, ...req.body, date: req.body?.date || now, currency: req.body?.currency || 'EUR' });
    if (!parsed.success) return res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    const input = parsed.data as any;
    input.createdAt = now; // ensure createdAt present for memory store shape
    store.createTransaction(user, input).then((t) => res.status(201).json(t)).catch((e) => res.status(500).json({ error: 'create_failed', detail: String(e) }));
  });

  app.patch('/transactions/:id', (req: Request, res: Response) => {
    const user = uid(req);
    const parsed = UpdateTxPatch.safeParse(req.body || {});
    if (!parsed.success) return res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    store.updateTransaction(user, req.params.id, parsed.data).then((t) => {
      if (!t) return res.status(404).json({ error: 'not_found' });
      res.json(t);
    }).catch((e) => res.status(500).json({ error: 'update_failed', detail: String(e) }));
  });

  app.delete('/transactions/:id', (req: Request, res: Response) => {
    const user = uid(req);
    store.deleteTransaction(user, req.params.id).then(() => res.status(204).send()).catch((e) => res.status(500).json({ error: 'delete_failed', detail: String(e) }));
  });
}
