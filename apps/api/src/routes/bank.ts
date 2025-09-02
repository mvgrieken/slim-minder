import { FastifyInstance } from 'fastify';
import { prisma } from '../prisma';
import { authMiddleware } from '../auth';
import { logger, logSecurityEvent } from '../utils/logger';
import { z } from 'zod';

// PSD2 Provider schemas
const PSD2ProviderSchema = z.enum(['tink', 'budget-insight', 'nordigen']);
const BankConnectionSchema = z.object({
  provider: PSD2ProviderSchema,
  redirectUrl: z.string().url(),
  permissions: z.array(z.enum(['accounts', 'transactions', 'balances'])).default(['accounts', 'transactions'])
});

const TransactionSyncSchema = z.object({
  accountId: z.string().uuid(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional()
});

export async function bankRoutes(fastify: FastifyInstance) {
  // Apply auth middleware to all bank routes
  fastify.addHook('preHandler', authMiddleware);

  // POST /bank/connect - Initiate PSD2 connection
  fastify.post('/bank/connect', {
    schema: {
      body: BankConnectionSchema
    },
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { provider, redirectUrl, permissions } = request.body as any;

        logSecurityEvent('PSD2_CONNECTION_ATTEMPT', {
          userId: user.id,
          provider,
          permissions
        });

        // Check if user already has an active connection
        const existingConnection = await prisma.accountLink.findFirst({
          where: {
            userId: user.id,
            provider,
            status: 'linked'
          }
        });

        if (existingConnection) {
          return reply.status(400).send({
            error: 'Connection Exists',
            message: 'User already has an active connection with this provider'
          });
        }

        // Create connection record
        const connection = await prisma.accountLink.create({
          data: {
            userId: user.id,
            provider,
            status: 'pending'
          }
        });

        // TODO: Integrate with actual PSD2 provider
        // This is a placeholder for the actual PSD2 flow
        const authUrl = await generatePSD2AuthUrl(provider, connection.id, redirectUrl, permissions);

        logger.info('PSD2 connection initiated', {
          userId: user.id,
          provider,
          connectionId: connection.id
        });

        return reply.status(200).send({
          connectionId: connection.id,
          authUrl,
          status: 'pending'
        });
      } catch (error) {
        logger.error('PSD2 connection failed', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to initiate bank connection'
        });
      }
    }
  });

  // GET /bank/callback - PSD2 callback handler
  fastify.get('/bank/callback', {
    handler: async (request, reply) => {
      try {
        const { code, state, error } = request.query as any;

        if (error) {
          logger.warn('PSD2 callback error', { error, state });
          return reply.status(400).send({
            error: 'PSD2 Error',
            message: 'Bank connection was cancelled or failed'
          });
        }

        // TODO: Exchange code for access token
        const connection = await handlePSD2Callback(code, state);

        logger.info('PSD2 connection completed', {
          connectionId: connection.id,
          userId: connection.userId
        });

        return reply.status(200).send({
          message: 'Bank connection successful',
          connectionId: connection.id
        });
      } catch (error) {
        logger.error('PSD2 callback failed', { error: error.message });
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to complete bank connection'
        });
      }
    }
  });

  // GET /bank/accounts - List connected bank accounts
  fastify.get('/bank/accounts', {
    handler: async (request, reply) => {
      try {
        const user = request.user;

        const accounts = await prisma.bankAccount.findMany({
          where: {
            userId: user.id
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return reply.send({
          data: accounts
        });
      } catch (error) {
        logger.error('Failed to fetch bank accounts', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to fetch bank accounts'
        });
      }
    }
  });

  // POST /bank/sync - Sync transactions from connected accounts
  fastify.post('/bank/sync', {
    schema: {
      body: TransactionSyncSchema
    },
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { accountId, fromDate, toDate } = request.body as any;

        // Verify account belongs to user
        const account = await prisma.bankAccount.findFirst({
          where: {
            id: accountId,
            userId: user.id
          }
        });

        if (!account) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Bank account not found'
          });
        }

        // TODO: Implement actual transaction sync
        const syncResult = await syncTransactions(account, fromDate, toDate);

        logger.info('Transaction sync completed', {
          userId: user.id,
          accountId,
          transactionsSynced: syncResult.count
        });

        return reply.send({
          message: 'Sync completed',
          transactionsSynced: syncResult.count,
          lastSync: new Date().toISOString()
        });
      } catch (error) {
        logger.error('Transaction sync failed', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to sync transactions'
        });
      }
    }
  });

  // DELETE /bank/accounts/:id - Disconnect bank account
  fastify.delete('/bank/accounts/:id', {
    handler: async (request, reply) => {
      try {
        const user = request.user;
        const { id } = request.params as { id: string };

        const account = await prisma.bankAccount.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!account) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Bank account not found'
          });
        }

        // Update connection status
        await prisma.accountLink.updateMany({
          where: {
            userId: user.id,
            provider: account.provider
          },
          data: {
            status: 'disconnected'
          }
        });

        // Delete account and related transactions
        await prisma.$transaction([
          prisma.transaction.deleteMany({
            where: { bankAccountId: id }
          }),
          prisma.bankAccount.delete({
            where: { id }
          })
        ]);

        logSecurityEvent('BANK_ACCOUNT_DISCONNECTED', {
          userId: user.id,
          accountId: id,
          provider: account.provider
        });

        return reply.status(204).send();
      } catch (error) {
        logger.error('Failed to disconnect bank account', {
          error: error.message,
          userId: request.user?.id
        });

        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'Failed to disconnect bank account'
        });
      }
    }
  });
}

// Placeholder functions for PSD2 integration
async function generatePSD2AuthUrl(provider: string, connectionId: string, redirectUrl: string, permissions: string[]) {
  // TODO: Implement actual PSD2 provider integration
  return `https://${provider}.com/auth?client_id=${process.env[`${provider.toUpperCase()}_CLIENT_ID`]}&redirect_uri=${redirectUrl}&state=${connectionId}&scope=${permissions.join(' ')}`;
}

async function handlePSD2Callback(code: string, state: string) {
  // TODO: Implement actual PSD2 callback handling
  const connection = await prisma.accountLink.update({
    where: { id: state },
    data: { status: 'linked' }
  });

  // TODO: Create bank account records
  await prisma.bankAccount.create({
    data: {
      userId: connection.userId,
      provider: connection.provider,
      providerAccountId: 'placeholder',
      displayName: 'Connected Account',
      currency: 'EUR'
    }
  });

  return connection;
}

async function syncTransactions(account: any, fromDate?: string, toDate?: string) {
  // TODO: Implement actual transaction sync
  logger.info('Transaction sync placeholder', {
    accountId: account.id,
    fromDate,
    toDate
  });

  return { count: 0 };
}
