import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { store } from '../store';

const CategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  icon: z.string().optional(),
  archived: z.boolean().default(false),
  createdAt: z.string(),
});

type Category = z.infer<typeof CategorySchema>;
const CreateCategoryInput = z.object({ name: z.string().trim().min(1), icon: z.string().optional() });
const UpdateCategoryInput = z.object({ name: z.string().trim().min(1).optional(), icon: z.string().optional(), archived: z.boolean().optional() });

function uid(req: Request) { return req.userId || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerCategoryRoutes(app: Express) {
  app.get('/categories', (req: Request, res: Response) => {
    const id = uid(req);
    store.listCategories(id).then((list) => res.json(list)).catch((e) => res.status(500).json({ error: 'list_failed', detail: String(e) }));
  });

  app.post('/categories', (req: Request, res: Response) => {
    const id = uid(req);
    if (!id) return res.status(401).json({ error: 'missing_user' });
    const parsed = CreateCategoryInput.safeParse(req.body || {});
    if (!parsed.success) return res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    store.createCategory(id, parsed.data).then((cat) => res.status(201).json(cat)).catch((e) => res.status(500).json({ error: 'create_failed', detail: String(e) }));
  });

  app.patch('/categories/:id', (req: Request, res: Response) => {
    const user = uid(req);
    const parsed = UpdateCategoryInput.safeParse(req.body || {});
    if (!parsed.success) return res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    store.updateCategory(user, req.params.id, parsed.data).then((cat) => {
      if (!cat) return res.status(404).json({ error: 'not_found' });
      res.json(cat);
    }).catch((e) => res.status(500).json({ error: 'update_failed', detail: String(e) }));
  });

  app.delete('/categories/:id', (req: Request, res: Response) => {
    const user = uid(req);
    store.deleteCategory(user, req.params.id).then(() => res.status(204).send()).catch((e) => res.status(500).json({ error: 'delete_failed', detail: String(e) }));
  });
}
