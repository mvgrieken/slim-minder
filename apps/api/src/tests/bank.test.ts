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
    bankAccount: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    accountLink: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  }
}));

describe('Bank Routes', () => {
  let app: Express;

  beforeAll(async () => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/bank/connect', () => {
    it('should start bank connection process', async () => {
      const response = await request(app)
        .post('/api/bank/connect')
        .send({
          provider: 'tink'
        })
        .expect(200);

      expect(response.body).toHaveProperty('authUrl');
      expect(response.body.authUrl).toContain('tink.com');
    });

    it('should validate provider parameter', async () => {
      const response = await request(app)
        .post('/api/bank/connect')
        .send({
          provider: 'invalid-provider'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/bank/accounts', () => {
    it('should return user bank accounts', async () => {
      const mockAccounts = [
        {
          id: 'account-1',
          name: 'Test Account',
          accountNumber: '1234567890',
          balance: 1000.00,
          currency: 'EUR',
          type: 'checking',
          status: 'active'
        }
      ];

      const { prisma } = require('../prisma');
      prisma.bankAccount.findMany.mockResolvedValue(mockAccounts);

      const response = await request(app)
        .get('/api/bank/accounts')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockAccounts);
    });
  });

  describe('POST /api/bank/sync', () => {
    it('should sync bank account transactions', async () => {
      const response = await request(app)
        .post('/api/bank/sync')
        .send({
          accountId: 'test-account-id'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('sync');
    });

    it('should validate accountId parameter', async () => {
      const response = await request(app)
        .post('/api/bank/sync')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/bank/accounts/:id', () => {
    it('should disconnect bank account', async () => {
      const { prisma } = require('../prisma');
      prisma.bankAccount.delete.mockResolvedValue({ id: 'test-account-id' });

      const response = await request(app)
        .delete('/api/bank/accounts/test-account-id')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('disconnected');
    });
  });
});
