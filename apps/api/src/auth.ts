import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const AUTH_OPTIONAL = (process.env.AUTH_OPTIONAL ?? 'true').toLowerCase() === 'true';
const USE_DB = (process.env.USE_DB ?? 'false').toLowerCase() === 'true';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : '';
  const secret = process.env.SUPABASE_JWT_SECRET || '';
  if (token && secret) {
    try {
      const payload = jwt.verify(token, secret) as any;
      const sub = String(payload.sub || '');
      if (sub) {
        req.userId = sub;
        req.auth = { provider: 'supabase', raw: payload };
        if (USE_DB) {
          // Ensure user exists in DB
          await prisma.user.upsert({ where: { id: sub }, update: {}, create: { id: sub } });
        }
        return next();
      }
    } catch (e) {
      if (!AUTH_OPTIONAL) return res.status(401).json({ error: 'invalid_token' });
    }
  }

  // Dev fallback: x-sm-user-id header
  const devId = (req.headers['x-sm-user-id'] as string) || '';
  if (devId) {
    req.userId = devId;
    req.auth = { provider: 'dev' };
    return next();
  }

  if (!AUTH_OPTIONAL) return res.status(401).json({ error: 'unauthorized' });
  req.auth = { provider: 'none' };
  return next();
}

