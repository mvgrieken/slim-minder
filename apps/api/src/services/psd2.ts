import { logger } from '../utils/logger';

// Conditionally import Tink API to avoid Jest issues
let TinkApi: any = null;
if (process.env.NODE_ENV !== 'test') {
  try {
    const tinkModule = require('@apiclient.xyz/tink');
    TinkApi = tinkModule.TinkApi;
  } catch (error) {
    logger.warn('Tink API not available, using mock implementation', { error: error.message });
  }
}

// PSD2 Provider configuration
interface PSD2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
}

// PSD2 Connection state
interface PSD2Connection {
  id: string;
  userId: string;
  provider: 'tink' | 'budget-insight' | 'nordigen';
  status: 'pending' | 'linked' | 'failed';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// PSD2 Account information
interface PSD2Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  currency: string;
  balance?: number;
  iban?: string;
  accountNumber?: string;
  status: 'active' | 'inactive';
}

// PSD2 Transaction
interface PSD2Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  category?: string;
  merchant?: string;
  type: 'debit' | 'credit';
}

class PSD2Service {
  private config: PSD2Config;
  private tinkApi: TinkApi;

  constructor(config: PSD2Config) {
    this.config = config;
    
    // Initialize Tink API only if available and not in test mode
    if (TinkApi && process.env.NODE_ENV !== 'test') {
      this.tinkApi = new TinkApi({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        environment: config.environment
      });
    } else {
      this.tinkApi = null;
      logger.info('PSD2 service initialized in mock mode');
    }
  }

  /**
   * Generate OAuth2 authorization URL for bank connection
   */
  async generateAuthUrl(userId: string, permissions: string[] = ['accounts', 'transactions']): Promise<{ authUrl: string; state: string }> {
    try {
      const state = this.generateState(userId);
      const scope = permissions.join(' ');
      
      // Use mock implementation in test mode or when Tink API is not available
      if (!this.tinkApi || process.env.NODE_ENV === 'test') {
        const mockAuthUrl = `https://link.tink.com/auth?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&scope=${scope}&state=${state}&response_type=code`;
        
        logger.info('PSD2 mock auth URL generated', {
          userId,
          provider: 'tink',
          state,
          scope
        });

        return { authUrl: mockAuthUrl, state };
      }
      
      const authUrl = await this.tinkApi.auth.getAuthorizationUrl({
        clientId: this.config.clientId,
        redirectUri: this.config.redirectUri,
        scope,
        state,
        responseType: 'code'
      });

      logger.info('PSD2 auth URL generated', {
        userId,
        provider: 'tink',
        state,
        scope
      });

      return { authUrl, state };
    } catch (error) {
      logger.error('Failed to generate PSD2 auth URL', {
        error: error.message,
        userId,
        provider: 'tink'
      });
      throw new Error('Failed to generate authorization URL');
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, state: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      // Use mock implementation in test mode or when Tink API is not available
      if (!this.tinkApi || process.env.NODE_ENV === 'test') {
        const mockTokens = {
          access_token: `mock-access-token-${Date.now()}`,
          refresh_token: `mock-refresh-token-${Date.now()}`,
          expires_in: 3600
        };
        
        logger.info('PSD2 mock token exchange successful', {
          state,
          provider: 'tink'
        });

        return {
          accessToken: mockTokens.access_token,
          refreshToken: mockTokens.refresh_token,
          expiresIn: mockTokens.expires_in
        };
      }
      
      const tokenResponse = await this.tinkApi.auth.exchangeCodeForToken({
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        code,
        redirectUri: this.config.redirectUri,
        grantType: 'authorization_code'
      });

      logger.info('PSD2 token exchange successful', {
        state,
        provider: 'tink'
      });

      return {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresIn: tokenResponse.expires_in
      };
    } catch (error) {
      logger.error('Failed to exchange PSD2 code for token', {
        error: error.message,
        state,
        provider: 'tink'
      });
      throw new Error('Failed to exchange authorization code');
    }
  }

  /**
   * Get user's bank accounts
   */
  async getAccounts(accessToken: string): Promise<PSD2Account[]> {
    try {
      // Use mock implementation in test mode or when Tink API is not available
      if (!this.tinkApi || process.env.NODE_ENV === 'test') {
        const mockAccounts: PSD2Account[] = [
          {
            id: 'mock-account-1',
            name: 'ING Bank - Hoofdrekening',
            type: 'checking',
            currency: 'EUR',
            balance: 1250.50,
            iban: 'NL91ABNA0417164300',
            accountNumber: '1234567890',
            status: 'active'
          },
          {
            id: 'mock-account-2',
            name: 'ING Bank - Spaarrekening',
            type: 'savings',
            currency: 'EUR',
            balance: 5000.00,
            iban: 'NL91ABNA0417164301',
            accountNumber: '1234567891',
            status: 'active'
          }
        ];
        
        logger.info('PSD2 mock accounts retrieved', {
          accountCount: mockAccounts.length,
          provider: 'tink'
        });

        return mockAccounts;
      }

      const accountsResponse = await this.tinkApi.accounts.getAccounts({
        accessToken
      });

      const accounts: PSD2Account[] = accountsResponse.accounts.map(account => ({
        id: account.id,
        name: account.name || 'Unknown Account',
        type: this.mapAccountType(account.type),
        currency: account.currencyCode || 'EUR',
        balance: account.balance,
        iban: account.iban,
        accountNumber: account.accountNumber,
        status: account.status === 'ACTIVE' ? 'active' : 'inactive'
      }));

      logger.info('PSD2 accounts retrieved', {
        accountCount: accounts.length,
        provider: 'tink'
      });

      return accounts;
    } catch (error) {
      logger.error('Failed to get PSD2 accounts', {
        error: error.message,
        provider: 'tink'
      });
      throw new Error('Failed to retrieve bank accounts');
    }
  }

  /**
   * Get transactions for an account
   */
  async getTransactions(accessToken: string, accountId: string, fromDate?: Date, toDate?: Date): Promise<PSD2Transaction[]> {
    try {
      // Use mock implementation in test mode or when Tink API is not available
      if (!this.tinkApi || process.env.NODE_ENV === 'test') {
        const mockTransactions: PSD2Transaction[] = [
          {
            id: 'mock-tx-1',
            accountId,
            amount: 25.50,
            currency: 'EUR',
            description: 'Albert Heijn - Boodschappen',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            category: 'groceries',
            merchant: 'Albert Heijn',
            type: 'debit'
          },
          {
            id: 'mock-tx-2',
            accountId,
            amount: 1200.00,
            currency: 'EUR',
            description: 'Salaris - Bedrijf BV',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            category: 'income',
            merchant: 'Bedrijf BV',
            type: 'credit'
          },
          {
            id: 'mock-tx-3',
            accountId,
            amount: 45.00,
            currency: 'EUR',
            description: 'Tankstation - Benzine',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            category: 'transport',
            merchant: 'Shell',
            type: 'debit'
          },
          {
            id: 'mock-tx-4',
            accountId,
            amount: 89.99,
            currency: 'EUR',
            description: 'Bol.com - Elektronica',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            category: 'shopping',
            merchant: 'Bol.com',
            type: 'debit'
          },
          {
            id: 'mock-tx-5',
            accountId,
            amount: 15.50,
            currency: 'EUR',
            description: 'Restaurant - Lunch',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
            category: 'food',
            merchant: 'Restaurant XYZ',
            type: 'debit'
          }
        ];
        
        logger.info('PSD2 mock transactions retrieved', {
          accountId,
          transactionCount: mockTransactions.length,
          provider: 'tink'
        });

        return mockTransactions;
      }

      const transactionsResponse = await this.tinkApi.transactions.getTransactions({
        accessToken,
        accountId,
        fromDate: fromDate?.toISOString(),
        toDate: toDate?.toISOString()
      });

      const transactions: PSD2Transaction[] = transactionsResponse.transactions.map(tx => ({
        id: tx.id,
        accountId: tx.accountId,
        amount: Math.abs(tx.amount),
        currency: tx.currencyCode || 'EUR',
        description: tx.description || 'Unknown transaction',
        date: new Date(tx.date),
        category: tx.category,
        merchant: tx.merchant,
        type: tx.amount >= 0 ? 'credit' : 'debit'
      }));

      logger.info('PSD2 transactions retrieved', {
        accountId,
        transactionCount: transactions.length,
        provider: 'tink'
      });

      return transactions;
    } catch (error) {
      logger.error('Failed to get PSD2 transactions', {
        error: error.message,
        accountId,
        provider: 'tink'
      });
      throw new Error('Failed to retrieve transactions');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const tokenResponse = await this.tinkApi.auth.refreshToken({
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        refreshToken,
        grantType: 'refresh_token'
      });

      logger.info('PSD2 token refreshed', {
        provider: 'tink'
      });

      return {
        accessToken: tokenResponse.access_token,
        expiresIn: tokenResponse.expires_in
      };
    } catch (error) {
      logger.error('Failed to refresh PSD2 token', {
        error: error.message,
        provider: 'tink'
      });
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Revoke access token
   */
  async revokeToken(accessToken: string): Promise<void> {
    try {
      await this.tinkApi.auth.revokeToken({
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        token: accessToken
      });

      logger.info('PSD2 token revoked', {
        provider: 'tink'
      });
    } catch (error) {
      logger.error('Failed to revoke PSD2 token', {
        error: error.message,
        provider: 'tink'
      });
      throw new Error('Failed to revoke access token');
    }
  }

  /**
   * Generate unique state parameter
   */
  private generateState(userId: string): string {
    return `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Map Tink account type to our internal type
   */
  private mapAccountType(tinkType: string): 'checking' | 'savings' | 'credit' | 'investment' {
    switch (tinkType?.toLowerCase()) {
      case 'checking':
      case 'current':
        return 'checking';
      case 'savings':
        return 'savings';
      case 'credit':
      case 'creditcard':
        return 'credit';
      case 'investment':
      case 'securities':
        return 'investment';
      default:
        return 'checking';
    }
  }
}

// Create PSD2 service instance
const psd2Service = new PSD2Service({
  clientId: process.env.TINK_CLIENT_ID || 'sandbox-client-id',
  clientSecret: process.env.TINK_CLIENT_SECRET || 'sandbox-client-secret',
  redirectUri: process.env.TINK_REDIRECT_URI || 'http://localhost:3000/api/bank/callback',
  environment: (process.env.TINK_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox'
});

export { PSD2Service, psd2Service };
export type { PSD2Config, PSD2Connection, PSD2Account, PSD2Transaction };
