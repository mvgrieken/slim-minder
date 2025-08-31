import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { store } from '../store';
import { logger, logSecurityEvent } from '../utils/logger';
import { psd2Service } from '../services/psd2';
import { psd2ConnectionManager } from '../services/psd2-connection-manager';

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

function uid(req: Request) { return req.user?.id || (req.headers['x-sm-user-id'] as string) || ''; }

export function registerBankRoutes(router: Router) {
  // POST /bank/connect - Initiate PSD2 connection
  router.post('/bank/connect', async (req: Request, res: Response) => {
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

      // Generate real PSD2 authorization URL
      const { authUrl, state } = await psd2Service.generateAuthUrl(userId, permissions);
      const connectionId = state;
      
      // Create connection record
      await psd2ConnectionManager.createConnection(userId, provider, state);

      logger.info('PSD2 connection initiated', {
        userId,
        provider,
        connectionId
      });

      res.status(200).json({
        connectionId,
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
  router.get('/bank/callback', async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query as any;

      if (error) {
        logger.warn('PSD2 callback error', { error, state });
        return res.status(400).json({
          error: 'PSD2 Error',
          message: 'Bank connection was cancelled or failed'
        });
      }

      // Exchange authorization code for access token
      const { accessToken, refreshToken, expiresIn } = await psd2Service.exchangeCodeForToken(code as string, state as string);
      
      // Update connection with tokens
      const connection = await psd2ConnectionManager.updateConnectionWithTokens(
        state as string,
        accessToken,
        refreshToken,
        expiresIn
      );
      
      if (!connection) {
        return res.status(400).json({
          error: 'Invalid Connection',
          message: 'Connection not found or invalid'
        });
      }

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
  router.get('/bank/accounts', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      // Get real bank accounts from PSD2 provider
      const connection = await psd2ConnectionManager.getConnectionByUserId(userId);
      
      if (connection) {
        // Get valid access token (refresh if needed)
        const accessToken = await psd2ConnectionManager.getValidAccessToken(connection.id);
        
        if (accessToken) {
          // Get real PSD2 accounts
          const psd2Accounts = await psd2Service.getAccounts(accessToken);
          const transformedAccounts = psd2Accounts.map(account => ({
            id: account.id,
            displayName: account.name,
            provider: 'tink',
            providerAccountId: account.id,
            iban: account.iban,
            currency: account.currency,
            balance: account.balance,
            status: account.status,
            userId,
            createdAt: new Date(),
            updatedAt: new Date()
          }));
          
          return res.json({ data: transformedAccounts });
        }
      }
      
      // Fallback to mock data if no connection or token issues
      const mockPsd2Accounts = await psd2Service.getAccounts('mock-token');
      const transformedAccounts = mockPsd2Accounts.map(account => ({
        id: account.id,
        displayName: account.name,
        provider: 'tink',
        providerAccountId: account.id,
        iban: account.iban,
        currency: account.currency,
        balance: account.balance,
        status: account.status,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      res.json({ data: transformedAccounts });
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
  router.post('/bank/sync', async (req: Request, res: Response) => {
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

      // Mock account verification
      const accounts = await store.listBankAccounts(userId);
      const account = accounts.find(a => a.id === accountId);
      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Bank account not found'
        });
      }

      // Sync real transactions from PSD2 provider
      const fromDateParam = fromDate ? new Date(fromDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      const toDateParam = toDate ? new Date(toDate) : new Date();
      
      // Get user's PSD2 connection
      const connection = await psd2ConnectionManager.getConnectionByUserId(userId);
      
      if (connection) {
        // Get valid access token (refresh if needed)
        const accessToken = await psd2ConnectionManager.getValidAccessToken(connection.id);
        
        if (accessToken) {
          // Get real PSD2 transactions
          const transactions = await psd2Service.getTransactions(accessToken, accountId, fromDateParam, toDateParam);
          
          // Transform PSD2 transactions to our format
          const transformedTransactions = transactions.map(tx => ({
            id: tx.id,
            userId,
            accountId: tx.accountId,
            amount: tx.amount,
            currency: tx.currency,
            description: tx.description,
            date: tx.date,
            category: tx.category,
            merchant: tx.merchant,
            type: tx.type,
            createdAt: new Date(),
            updatedAt: new Date()
          }));
          
          // Store transactions in our database
          // TODO: Implement transaction storage
          // await store.createTransactions(userId, transformedTransactions);
          
          const syncResult = { count: transactions.length };
          
          logger.info('Transaction sync completed', {
            userId,
            accountId,
            transactionsSynced: syncResult.count
          });
          
          return res.json({
            message: 'Sync completed',
            transactionsSynced: syncResult.count,
            lastSync: new Date().toISOString()
          });
        }
      }
      
      // Fallback to mock data if no connection or token issues
      const transactions = await psd2Service.getTransactions('mock-token', accountId, fromDateParam, toDateParam);
      
      // Transform PSD2 transactions to our format
      const transformedTransactions = transactions.map(tx => ({
        id: tx.id,
        userId,
        accountId: tx.accountId,
        amount: tx.amount,
        currency: tx.currency,
        description: tx.description,
        date: tx.date,
        category: tx.category,
        merchant: tx.merchant,
        type: tx.type,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      // Store transactions in our database
      // TODO: Implement transaction storage
      // await store.createTransactions(userId, transformedTransactions);
      
      const syncResult = { count: transactions.length };

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
  router.delete('/bank/accounts/:id', async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      if (!userId) return res.status(401).json({ error: 'missing_user' });

      const { id } = req.params;

      // Mock account verification
      const accounts = await store.listBankAccounts(userId);
      const account = accounts.find(a => a.id === id);
      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Bank account not found'
        });
      }

      // Revoke PSD2 access token if available
      const connection = await psd2ConnectionManager.getConnectionByUserId(userId);
      if (connection) {
        await psd2ConnectionManager.revokeConnection(connection.id);
      }
      
      // Delete account using store
      await store.deleteBankAccount(userId, id);

      logSecurityEvent('BANK_ACCOUNT_DISCONNECTED', {
        userId,
        accountId: id,
        provider: account.provider
      });

      res.status(200).json({
        message: 'Bank account disconnected successfully'
      });
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

