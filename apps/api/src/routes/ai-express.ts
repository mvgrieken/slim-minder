import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

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

function uid(req: Request) { return req.userId || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerAIRoutes(app: Express) {
  // POST /ai/chat - Send message to AI coach
  app.post('/ai/chat', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const parsed = ChatMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: 'invalid_body', 
          issues: parsed.error.issues 
        });
      }

      const { message, context } = parsed.data;

      logger.info('AI chat request', {
        userId,
        messageLength: message.length
      });

      // Get user context for AI
      const userContext = await buildUserContext(userId, context);

      // Generate AI response
      const aiResponse = await generateAIResponse(message, userContext);

      // Store chat interaction
      const chatInteraction = await prisma.chatInteraction.create({
        data: {
          userId,
          userMessage: message,
          aiResponse: aiResponse.message,
          context: userContext,
          metadata: {
            tokensUsed: aiResponse.tokensUsed,
            model: aiResponse.model
          }
        }
      });

      logger.info('AI chat response generated', {
        userId,
        interactionId: chatInteraction.id,
        tokensUsed: aiResponse.tokensUsed
      });

      res.json({
        id: chatInteraction.id,
        message: aiResponse.message,
        suggestions: aiResponse.suggestions,
        metadata: {
          tokensUsed: aiResponse.tokensUsed,
          model: aiResponse.model
        }
      });
    } catch (error) {
      logger.error('AI chat failed', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to process chat message'
      });
    }
  });

  // GET /ai/chat - Get chat history
  app.get('/ai/chat', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const parsed = ChatHistorySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: 'invalid_query', 
          issues: parsed.error.issues 
        });
      }

      const { limit, before } = parsed.data;

      const where: any = { userId };
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

      res.json({
        data: interactions.reverse(), // Return in chronological order
        pagination: {
          hasMore: interactions.length === limit,
          nextCursor: interactions.length > 0 ? interactions[interactions.length - 1].createdAt.toISOString() : null
        }
      });
    } catch (error) {
      logger.error('Failed to fetch chat history', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch chat history'
      });
    }
  });

  // GET /ai/context - Get current user context for AI
  app.get('/ai/context', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const context = await buildUserContext(userId);

      res.json({
        context: {
          userId,
          budgetSummary: context.budgetSummary,
          recentTransactions: context.recentTransactions,
          goals: context.goals,
          spendingPatterns: context.spendingPatterns
        }
      });
    } catch (error) {
      logger.error('Failed to build AI context', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to build user context'
      });
    }
  });

  // POST /ai/feedback/:interactionId - Rate AI response
  app.post('/ai/feedback/:interactionId', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const { interactionId } = req.params;
      const parsed = z.object({
        rating: z.number().min(1).max(5),
        feedback: z.string().max(500).optional()
      }).safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ 
          error: 'invalid_body', 
          issues: parsed.error.issues 
        });
      }

      const { rating, feedback } = parsed.data;

      const interaction = await prisma.chatInteraction.findFirst({
        where: {
          id: interactionId,
          userId
        }
      });

      if (!interaction) {
        return res.status(404).json({
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
        userId,
        interactionId,
        rating
      });

      res.json({
        message: 'Feedback recorded successfully'
      });
    } catch (error) {
      logger.error('Failed to record AI feedback', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to record feedback'
      });
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

async function generateAIResponse(message: string, context: any) {
  // TODO: Implement actual OpenAI/Claude integration
  const prompt = buildAIPrompt(message, context);
  
  // Placeholder response
  const response = {
    message: `Ik zie dat je vraagt: "${message}". Gebaseerd op je financiële situatie kan ik je helpen met budgettering en besparingstips.`,
    suggestions: [
      'Wil je een overzicht van je huidige budgetten?',
      'Zal ik je helpen met het instellen van nieuwe doelen?',
      'Kan ik je adviseren over besparingsmogelijkheden?'
    ],
    tokensUsed: 150,
    model: 'gpt-4'
  };

  logger.info('AI response generated', {
    messageLength: message.length,
    responseLength: response.message.length,
    tokensUsed: response.tokensUsed
  });

  return response;
}

function buildAIPrompt(message: string, context: any) {
  return `
Je bent Slim Minder, een persoonlijke financiële coach die gebruikers helpt met budgettering en besparing.

Gebruiker context:
- Budgetten: ${JSON.stringify(context.budgetSummary)}
- Recente transacties: ${JSON.stringify(context.recentTransactions)}
- Doelen: ${JSON.stringify(context.goals)}

Gebruiker vraag: ${message}

Geef een behulpzaam, persoonlijk antwoord in het Nederlands. Focus op praktische adviezen en concrete stappen.
  `.trim();
}
