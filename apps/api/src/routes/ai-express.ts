import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { store } from '../store';
import { logger } from '../utils/logger';
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

function uid(req: Request) { return req.user?.id || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerAIRoutes(router: Router) {
  // POST /ai/chat - Send message to AI coach
  router.post('/ai/chat', async (req: Request, res: Response) => {
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

      // Generate AI response using AI service
      const aiResponse = await aiService.generateResponse(message, userContext);

      // Store chat interaction using store
      const chatInteraction = await store.createChatInteraction(userId, {
        userMessage: message,
        aiResponse: aiResponse.message,
        context: userContext,
        metadata: {
          tokensUsed: aiResponse.tokensUsed,
          model: aiResponse.model,
          provider: aiResponse.provider
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
          model: aiResponse.model,
          provider: aiResponse.provider
        }
      });
    } catch (error) {
      const err = error as any;
      logger.error('AI chat failed', {
        error: err?.message || String(err),
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to process chat message'
      });
    }
  });

  // GET /ai/chat - Get chat history
  router.get('/ai/chat', async (req: Request, res: Response) => {
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

      // Get chat history using store
      const interactions = await store.listChatInteractions(userId, { limit, before });

      res.json({
        data: interactions.reverse(), // Return in chronological order
        pagination: {
          hasMore: interactions.length === limit,
          nextCursor: interactions.length > 0 ? interactions[interactions.length - 1].createdAt : null
        }
      });
    } catch (error) {
      const err = error as any;
      logger.error('Failed to fetch chat history', {
        error: err?.message || String(err),
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch chat history'
      });
    }
  });

  // GET /ai/context - Get current user context for AI
  router.get('/ai/context', async (req: Request, res: Response) => {
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
      const err = error as any;
      logger.error('Failed to build AI context', {
        error: err?.message || String(err),
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to build user context'
      });
    }
  });

  // POST /ai/feedback/:interactionId - Rate AI response
  router.post('/ai/feedback/:interactionId', async (req: Request, res: Response) => {
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

      // Update interaction using store
      const interaction = await store.updateChatInteraction(userId, interactionId, {
        userRating: rating,
        userFeedback: feedback
      });

      if (!interaction) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Chat interaction not found'
        });
      }

      logger.info('AI feedback received', {
        userId,
        interactionId,
        rating
      });

      res.json({
        message: 'Feedback recorded successfully'
      });
    } catch (error) {
      const err = error as any;
      logger.error('Failed to record AI feedback', {
        error: err?.message || String(err),
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to record feedback'
      });
    }
  });

  // GET /ai/status - Get AI provider status
  router.get('/ai/status', async (req: Request, res: Response) => {
    try {
      const status = aiService.getProviderStatus();
      
      res.json({
        status: 'ok',
        provider: status.provider,
        available: status.available,
        hasApiKey: status.hasApiKey
      });
    } catch (error) {
      const err = error as any;
      logger.error('Failed to get AI status', {
        error: err?.message || String(err)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get AI status'
      });
    }
  });
}

// Default export for compatibility
const aiRouter = Router();
registerAIRoutes(aiRouter);
export default aiRouter;

// Helper functions
async function buildUserContext(userId: string, additionalContext?: any) {
  // Get data from store
  const [budgets, recentTransactions, categories] = await Promise.all([
    store.listBudgets(userId),
    store.listTransactions(userId, { from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10) }),
    store.listCategories(userId)
  ]);

  // Return mock context for development/testing
  return {
    budgetSummary: budgets.map(b => {
      const category = categories.find(c => c.id === b.categoryId);
      const spent = recentTransactions
        .filter(t => t.categoryId === b.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        category: category?.name || 'Unknown',
        limit: b.limit,
        spent,
        remaining: b.limit - spent
      };
    }),
    recentTransactions: recentTransactions.slice(0, 10).map(t => ({
      amount: t.amount,
      description: t.description,
      category: categories.find(c => c.id === t.categoryId)?.name,
      date: t.date
    })),
    goals: [
      {
        title: 'Vakantie spaarrekening',
        targetAmount: 2000,
        deadline: new Date('2024-12-31')
      }
    ],
    spendingPatterns: categories.map(cat => {
      const transactions = recentTransactions.filter(t => t.categoryId === cat.id);
      return {
        categoryId: cat.id,
        totalSpent: transactions.reduce((sum, t) => sum + t.amount, 0),
        transactionCount: transactions.length
      };
    }),
    ...additionalContext
  };
}

