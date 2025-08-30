import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../main';

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-id' };
    next();
  }
}));

// Mock Prisma
jest.mock('../prisma', () => ({
  prisma: {
    chatInteraction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  }
}));

describe('AI Routes', () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/ai/chat', () => {
    it('should create chat interaction and return AI response', async () => {
      const mockChatInteraction = {
        id: 'chat-1',
        userId: 'test-user-id',
        userMessage: 'Hoe kan ik geld besparen?',
        aiResponse: 'Hier zijn enkele tips om geld te besparen...',
        context: {},
        metadata: {},
        createdAt: new Date(),
      };

      const { prisma } = require('../prisma');
      prisma.chatInteraction.create.mockResolvedValue(mockChatInteraction);

      const response = await request(app)
        .post('/api/ai/chat')
        .send({
          message: 'Hoe kan ik geld besparen?'
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('tips');
    });

    it('should validate message parameter', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject empty message', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({
          message: ''
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/ai/chat', () => {
    it('should return chat history', async () => {
      const mockChatHistory = [
        {
          id: 'chat-1',
          userId: 'test-user-id',
          userMessage: 'Hoe kan ik geld besparen?',
          aiResponse: 'Hier zijn enkele tips...',
          context: {},
          metadata: {},
          createdAt: new Date(),
        }
      ];

      const { prisma } = require('../prisma');
      prisma.chatInteraction.findMany.mockResolvedValue(mockChatHistory);

      const response = await request(app)
        .get('/api/ai/chat')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockChatHistory);
    });
  });

  describe('GET /api/ai/context', () => {
    it('should return user context for AI', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      const { prisma } = require('../prisma');
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/ai/context')
        .expect(200);

      expect(response.body).toHaveProperty('context');
      expect(response.body.context).toHaveProperty('userId');
    });
  });

  describe('POST /api/ai/feedback/:interactionId', () => {
    it('should update chat interaction with feedback', async () => {
      const mockUpdatedInteraction = {
        id: 'chat-1',
        userRating: 5,
        userFeedback: 'Zeer behulpzaam!',
      };

      const { prisma } = require('../prisma');
      prisma.chatInteraction.update.mockResolvedValue(mockUpdatedInteraction);

      const response = await request(app)
        .post('/api/ai/feedback/chat-1')
        .send({
          rating: 5,
          feedback: 'Zeer behulpzaam!'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('feedback');
    });

    it('should validate rating parameter', async () => {
      const response = await request(app)
        .post('/api/ai/feedback/chat-1')
        .send({
          rating: 6, // Invalid rating (should be 1-5)
          feedback: 'Test feedback'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
