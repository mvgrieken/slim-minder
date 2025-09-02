import { FastifyInstance } from 'fastify';
import { prisma } from '../prisma';
import { authMiddleware } from '../auth';
import { 
  CreateBudgetSchema, 
  UpdateBudgetSchema, 
  PaginationSchema,
  createValidationMiddleware,
  createQueryValidationMiddleware
} from '../middleware/validation';

export async function budgetRoutes(fastify: FastifyInstance) {
  // Apply auth middleware to all budget routes
  fastify.addHook('preHandler', authMiddleware);

  // GET /budgets - List user budgets with pagination
  fastify.get('/budgets', {
    preHandler: createQueryValidationMiddleware(PaginationSchema),
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { page, limit, sortBy, sortOrder } = request.query as any;

        const skip = (page - 1) * limit;
        const orderBy = sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' };

        const [budgets, total] = await Promise.all([
          prisma.budget.findMany({
            where: { userId: user.id },
            include: { category: true },
            skip,
            take: limit,
            orderBy
          }),
          prisma.budget.count({
            where: { userId: user.id }
          })
        ]);

        return reply.send({
          data: budgets,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        request.log.error('Failed to fetch budgets:', error);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to fetch budgets'
        });
      }
    }
  });

  // POST /budgets - Create new budget
  fastify.post('/budgets', {
    preHandler: createValidationMiddleware(CreateBudgetSchema),
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const budgetData = request.body as any;

        // Check if category exists and belongs to user
        const category = await prisma.category.findFirst({
          where: {
            id: budgetData.categoryId,
            userId: user.id
          }
        });

        if (!category) {
          return reply.status(400).send({
            error: 'Validation Error',
            message: 'Category not found or does not belong to user'
          });
        }

        const budget = await prisma.budget.create({
          data: {
            ...budgetData,
            userId: user.id
          },
          include: { category: true }
        });

        return reply.status(201).send(budget);
      } catch (error) {
        request.log.error('Failed to create budget:', error);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to create budget'
        });
      }
    }
  });

  // GET /budgets/:id - Get specific budget
  fastify.get('/budgets/:id', {
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { id } = request.params as { id: string };

        const budget = await prisma.budget.findFirst({
          where: {
            id,
            userId: user.id
          },
          include: { category: true }
        });

        if (!budget) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Budget not found'
          });
        }

        return reply.send(budget);
      } catch (error) {
        request.log.error('Failed to fetch budget:', error);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to fetch budget'
        });
      }
    }
  });

  // PATCH /budgets/:id - Update budget
  fastify.patch('/budgets/:id', {
    preHandler: createValidationMiddleware(UpdateBudgetSchema),
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { id } = request.params as { id: string };
        const updateData = request.body as any;

        const budget = await prisma.budget.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!budget) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Budget not found'
          });
        }

        const updatedBudget = await prisma.budget.update({
          where: { id },
          data: updateData,
          include: { category: true }
        });

        return reply.send(updatedBudget);
      } catch (error) {
        request.log.error('Failed to update budget:', error);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to update budget'
        });
      }
    }
  });

  // DELETE /budgets/:id - Delete budget
  fastify.delete('/budgets/:id', {
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { id } = request.params as { id: string };

        const budget = await prisma.budget.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!budget) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Budget not found'
          });
        }

        await prisma.budget.delete({
          where: { id }
        });

        return reply.status(204).send();
      } catch (error) {
        request.log.error('Failed to delete budget:', error);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to delete budget'
        });
      }
    }
  });
}
