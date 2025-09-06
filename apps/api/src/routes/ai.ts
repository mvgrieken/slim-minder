import { FastifyInstance } from 'fastify';
import { prisma } from '../prisma';
import { authMiddleware } from '../auth';
import { logger } from '../utils/logger';
import { z } from 'zod';
import { aiService } from '../services/ai';

// AI Chat schemas
const ChatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    userId: z.string().uuid(),
    currentBudget: z.any().optional(),
    recentTransactions: z.array(z.any()).optional()
  }).optional()
});

const ChatHistorySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(20),
  before: z.string().datetime().optional()
});

export async function aiRoutes(fastify: FastifyInstance) {
  // Apply auth middleware to all AI routes
  fastify.addHook('preHandler', authMiddleware);

  // POST /ai/chat - Send message to AI coach
  fastify.post('/ai/chat', {
    schema: {
      body: ChatMessageSchema
    },
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { message, context } = request.body as any;

        logger.info('AI chat request', {
          userId: user.id,
          messageLength: message.length
        });

        // Get user context for AI
        const userContext = await buildUserContext(user.id, context);

        // Generate AI response using AI service
        const aiResponse = await aiService.generateResponse(message, userContext);

        // Store chat interaction
        const chatInteraction = await prisma.chatInteraction.create({
          data: {
            userId: user.id,
            userMessage: message,
            aiResponse: aiResponse.message,
            context: userContext,
            metadata: {
              tokensUsed: aiResponse.tokensUsed,
              model: aiResponse.model,
              provider: aiResponse.provider
            }
          }
        });

        logger.info('AI chat response generated', {
          userId: user.id,
          interactionId: chatInteraction.id,
          tokensUsed: aiResponse.tokensUsed
        });

        return reply.send({
          id: chatInteraction.id,
          message: aiResponse.message,
          suggestions: aiResponse.suggestions,
          metadata: {
            tokensUsed: aiResponse.tokensUsed,
            model: aiResponse.model,
            provider: aiResponse.provider
          }
        });
      } catch (error) {
        logger.error('AI chat failed', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to process chat message'
        });
      }
    }
  });

  // GET /ai/chat - Get chat history
  fastify.get('/ai/chat', {
    schema: {
      querystring: ChatHistorySchema
    },
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { limit, before } = request.query as any;

        const where: any = { userId: user.id };
        if (before) {
          where.createdAt = { lt: new Date(before) };
        }

        const interactions = await prisma.chatInteraction.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          select: {
            id: true,
            userMessage: true,
            aiResponse: true,
            createdAt: true,
            metadata: true
          }
        });

        return reply.send({
          data: interactions.reverse(), // Return in chronological order
          pagination: {
            hasMore: interactions.length === limit,
            nextCursor: interactions.length > 0 ? interactions[interactions.length - 1].createdAt.toISOString() : null
          }
        });
      } catch (error) {
        logger.error('Failed to fetch chat history', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to fetch chat history'
        });
      }
    }
  });

  // GET /ai/context - Get current user context for AI
  fastify.get('/ai/context', {
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const context = await buildUserContext(user.id);

        return reply.send({
          context: {
            userId: user.id,
            budgetSummary: context.budgetSummary,
            recentTransactions: context.recentTransactions,
            goals: context.goals,
            spendingPatterns: context.spendingPatterns
          }
        });
      } catch (error) {
        logger.error('Failed to build AI context', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to build user context'
        });
      }
    }
  });

  // POST /ai/feedback - Rate AI response
  fastify.post('/ai/feedback/:interactionId', {
    schema: {
      body: z.object({
        rating: z.number().min(1).max(5),
        feedback: z.string().max(500).optional()
      })
    },
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { interactionId } = request.params as { interactionId: string };
        const { rating, feedback } = request.body as any;

        const interaction = await prisma.chatInteraction.findFirst({
          where: {
            id: interactionId,
            userId: user.id
          }
        });

        if (!interaction) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Chat interaction not found'
          });
        }

        await prisma.chatInteraction.update({
          where: { id: interactionId },
          data: {
            userRating: rating,
            userFeedback: feedback
          }
        });

        logger.info('AI feedback received', {
          userId: user.id,
          interactionId,
          rating
        });

        return reply.send({
          message: 'Feedback recorded successfully'
        });
      } catch (error) {
        logger.error('Failed to record AI feedback', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to record feedback'
        });
      }
    }
  });
}

// Helper functions
async function buildUserContext(userId: string, additionalContext?: any) {
  const [
    budgets,
    recentTransactions,
    goals,
    spendingByCategory
  ] = await Promise.all([
    // Get current budgets
    prisma.budget.findMany({
      where: { userId, active: true },
      include: { category: true }
    }),
    
    // Get recent transactions
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
      include: { category: true }
    }),
    
    // Get active goals
    prisma.goal.findMany({
      where: { userId }
    }),
    
    // Get spending by category for current month
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true },
      _count: true
    })
  ]);

  return {
    budgetSummary: budgets.map(b => ({
      category: b.category.name,
      limit: b.limit,
      spent: 0, // TODO: Calculate spent amount
      remaining: b.limit
    })),
    recentTransactions: recentTransactions.map(t => ({
      amount: t.amount,
      description: t.description,
      category: t.category?.name,
      date: t.date
    })),
    goals: goals.map(g => ({
      title: g.title,
      targetAmount: g.targetAmount,
      deadline: g.deadline
    })),
    spendingPatterns: spendingByCategory.map(s => ({
      categoryId: s.categoryId,
      totalSpent: s._sum.amount,
      transactionCount: s._count
    })),
    ...additionalContext
  };
}

  // GET /ai/status - Get AI provider status
  fastify.get('/ai/status', {
    handler: async (request, reply) => {
      try {
        const status = aiService.getProviderStatus();
        
        return reply.send({
          status: 'ok',
          provider: status.provider,
          available: status.available,
          hasApiKey: status.hasApiKey
        });
      } catch (error) {
        logger.error('Failed to get AI status', {
          error: error.message
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to get AI status'
        });
      }
    }
  });
