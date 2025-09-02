import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Common validation schemas
export const UUIDSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const AmountSchema = z.number().positive();
export const DateSchema = z.string().datetime();

// User validation schemas
export const CreateUserSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
  name: z.string().min(1).max(100)
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  preferences: z.record(z.unknown()).optional()
});

// Budget validation schemas
export const CreateBudgetSchema = z.object({
  categoryId: UUIDSchema,
  limit: AmountSchema,
  currency: z.string().length(3),
  period: z.enum(['month', 'week']).default('month'),
  startsOn: DateSchema
});

export const UpdateBudgetSchema = z.object({
  limit: AmountSchema.optional(),
  currency: z.string().length(3).optional(),
  active: z.boolean().optional()
});

// Transaction validation schemas
export const CreateTransactionSchema = z.object({
  bankAccountId: UUIDSchema.optional(),
  date: DateSchema,
  amount: AmountSchema,
  currency: z.string().length(3),
  description: z.string().max(255).optional(),
  merchant: z.string().max(100).optional(),
  categoryId: UUIDSchema.optional()
});

export const UpdateTransactionSchema = z.object({
  description: z.string().max(255).optional(),
  merchant: z.string().max(100).optional(),
  categoryId: UUIDSchema.optional()
});

// Category validation schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().max(50).optional()
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  icon: z.string().max(50).optional(),
  archived: z.boolean().optional()
});

// Goal validation schemas
export const CreateGoalSchema = z.object({
  title: z.string().min(1).max(100),
  targetAmount: AmountSchema,
  currency: z.string().length(3),
  deadline: DateSchema.optional()
});

export const UpdateGoalSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  targetAmount: AmountSchema.optional(),
  deadline: DateSchema.optional()
});

// Validation middleware factory
export function createValidationMiddleware(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Validation processing failed'
      });
    }
  };
}

// Query parameter validation
export function createQueryValidationMiddleware(schema: z.ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Query validation processing failed'
      });
    }
  };
}

// Common query schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export const DateRangeSchema = z.object({
  startDate: DateSchema.optional(),
  endDate: DateSchema.optional()
});
