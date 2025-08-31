import { Router, Request, Response } from 'express';
import { store } from '../store';

type User = { id: string; createdAt: string };

function getUserId(req: Request) { return req.userId || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerUserRoutes(router: Router) {
  router.post('/users/guest', (_req: Request, res: Response) => {
    store.createGuest().then((u) => res.status(201).json({ id: u.id })).catch((e) => res.status(500).json({ error: 'create_failed', detail: String(e) }));
  });

  router.get('/me', (req: Request, res: Response) => {
    const id = getUserId(req);
    if (!id) return res.status(401).json({ error: 'missing_user' });
    store.getUser(id).then((user) => {
      if (!user) return res.status(404).json({ error: 'user_not_found' });
      res.json(user);
    }).catch((e) => res.status(500).json({ error: 'load_failed', detail: String(e) }));
  });

  // Auth info helper
  router.get('/auth/me', (req: Request, res: Response) => {
    const id = req.userId || '';
    res.json({ userId: id, auth: req.auth || { provider: 'none' } });
  });
}
