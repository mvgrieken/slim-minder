import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Define error interface for Prisma-like errors
interface PrismaError extends Error {
  code?: string;
}

export function errorHandler(
  error: AppError | ZodError | PrismaError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id || req.headers['x-sm-user-id']
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'validation_error',
      message: 'Invalid request data',
      issues: error.issues
    });
  }

  // Handle Prisma errors
  else if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as PrismaError;
    switch (prismaError.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'duplicate_entry',
          message: 'Resource already exists'
        });
      case 'P2025':
        return res.status(404).json({
          error: 'not_found',
          message: 'Resource not found'
        });
      default:
        return res.status(500).json({
          error: 'database_error',
          message: 'Database operation failed'
        });
    }
  }

  // Handle custom app errors
  else if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code || 'app_error',
      message: error.message
    });
  }

  // Handle generic errors
  else {
    return res.status(500).json({
      error: 'internal_error',
      message: 'Internal server error'
    });
  }
}
