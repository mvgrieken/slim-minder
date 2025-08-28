import { Express, Request, Response } from 'express';

export function registerHealthRoutes(app: Express) {
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.get('/version', (_req: Request, res: Response) => {
    res.json({ version: '0.1.0' });
  });
}

