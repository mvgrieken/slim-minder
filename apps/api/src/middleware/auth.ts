import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { CustomError } from './errorHandler';

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role?: string;
      };
    }
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip auth for health check
    if (req.path === '/health') {
      return next();
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    // Development fallback for testing
    if (process.env.NODE_ENV === 'development' && !token) {
      const devUserId = req.headers['x-sm-user-id'] as string;
      if (devUserId) {
        req.user = { id: devUserId, role: 'user' };
        return next();
      }
    }

    if (!token) {
      throw new CustomError('No token provided', 401);
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new CustomError('Invalid or expired token', 401);
    }

    // Add user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user'
    };

    next();
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
          statusCode: error.statusCode
        }
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: {
        message: 'Authentication failed',
        statusCode: 500
      }
    });
  }
};

// Optional auth middleware for endpoints that can work with or without auth
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return next(); // Continue without user
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'user'
      };
    }

    next();
  } catch (error) {
    // Continue without user on error
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          statusCode: 401
        }
      });
    }

    if (!roles.includes(req.user.role || 'user')) {
      return res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          statusCode: 403
        }
      });
    }

    next();
  };
};
