import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger, logSecurityEvent } from '../utils/logger';

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

function uid(req: Request) { return req.userId || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerBankRoutes(app: Express) {
  // POST /bank/connect - Initiate PSD2 connection
  app.post('/bank/connect', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const parsed = BankConnectionSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: 'invalid_body', 
          issues: parsed.error.issues 
        });
      }

      const { provider, redirectUrl, permissions } = parsed.data;

      logSecurityEvent('PSD2_CONNECTION_ATTEMPT', {
        userId,
        provider,
        permissions
      });

      // Check if user already has an active connection
      const existingConnection = await prisma.accountLink.findFirst({
        where: {
          userId,
          provider,
          status: 'linked'
        }
      });

      if (existingConnection) {
        return res.status(400).json({
          error: 'Connection Exists',
          message: 'User already has an active connection with this provider'
        });
      }

      // Create connection record
      const connection = await prisma.accountLink.create({
        data: {
          userId,
          provider,
          status: 'pending'
        }
      });

      // TODO: Integrate with actual PSD2 provider
      const authUrl = await generatePSD2AuthUrl(provider, connection.id, redirectUrl, permissions);

      logger.info('PSD2 connection initiated', {
        userId,
        provider,
        connectionId: connection.id
      });

      res.status(200).json({
        connectionId: connection.id,
        authUrl,
        status: 'pending'
      });
    } catch (error) {
      logger.error('PSD2 connection failed', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to initiate bank connection'
      });
    }
  });

  // GET /bank/callback - PSD2 callback handler
  app.get('/bank/callback', async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query as any;

      if (error) {
        logger.warn('PSD2 callback error', { error, state });
        return res.status(400).json({
          error: 'PSD2 Error',
          message: 'Bank connection was cancelled or failed'
        });
      }

      // TODO: Exchange code for access token
      const connection = await handlePSD2Callback(code as string, state as string);

      logger.info('PSD2 connection completed', {
        connectionId: connection.id,
        userId: connection.userId
      });

      res.status(200).json({
        message: 'Bank connection successful',
        connectionId: connection.id
      });
    } catch (error) {
      logger.error('PSD2 callback failed', { error: error.message });
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to complete bank connection'
      });
    }
  });

  // GET /bank/accounts - List connected bank accounts
  app.get('/bank/accounts', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const accounts = await prisma.bankAccount.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ data: accounts });
    } catch (error) {
      logger.error('Failed to fetch bank accounts', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch bank accounts'
      });
    }
  });

  // POST /bank/sync - Sync transactions from connected accounts
  app.post('/bank/sync', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const parsed = TransactionSyncSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: 'invalid_body', 
          issues: parsed.error.issues 
        });
      }

      const { accountId, fromDate, toDate } = parsed.data;

      // Verify account belongs to user
      const account = await prisma.bankAccount.findFirst({
        where: {
          id: accountId,
          userId
        }
      });

      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Bank account not found'
        });
      }

      // TODO: Implement actual transaction sync
      const syncResult = await syncTransactions(account, fromDate, toDate);

      logger.info('Transaction sync completed', {
        userId,
        accountId,
        transactionsSynced: syncResult.count
      });

      res.json({
        message: 'Sync completed',
        transactionsSynced: syncResult.count,
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Transaction sync failed', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to sync transactions'
      });
    }
  });

  // DELETE /bank/accounts/:id - Disconnect bank account
  app.delete('/bank/accounts/:id', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const { id } = req.params;

      const account = await prisma.bankAccount.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Bank account not found'
        });
      }

      // Update connection status
      await prisma.accountLink.updateMany({
        where: {
          userId,
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
        userId,
        accountId: id,
        provider: account.provider
      });

      res.status(204).send();
    } catch (error) {
      logger.error('Failed to disconnect bank account', {
        error: error.message,
        userId: uid(req)
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to disconnect bank account'
      });
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
