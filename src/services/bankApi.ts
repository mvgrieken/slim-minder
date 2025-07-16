// PSD2 Bank Integration API Service
// This service handles bank connections via PSD2 (Payment Services Directive 2)

export interface BankConnection {
  id: string;
  bankId: string;
  bankName: string;
  accountId: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  connectedAt: string;
  lastSync: string;
  status: 'active' | 'expired' | 'error';
}

export interface BankSyncResult {
  success: boolean;
  newTransactions: number;
  updatedTransactions: number;
  errors: string[];
  lastSync: string;
}

export interface PSD2AuthUrl {
  authUrl: string;
  state: string;
  expiresAt: string;
}

// Mock data for development
const mockBankConnections: BankConnection[] = [
  {
    id: '1',
    bankId: 'ing',
    bankName: 'ING Bank',
    accountId: 'NL91ABNA0417164300',
    accountName: 'Betaalrekening',
    accountType: 'checking',
    balance: 2450.67,
    currency: 'EUR',
    connectedAt: '2024-01-01T10:00:00Z',
    lastSync: '2024-01-15T10:30:00Z',
    status: 'active'
  }
];

export class BankApiService {
  // Get all connected banks for a user
  static async getBankConnections(userId: string): Promise<BankConnection[]> {
    // In a real implementation, this would call the backend API
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBankConnections);
      }, 500);
    });
  }

  // Initiate PSD2 connection with a bank
  static async initiateBankConnection(
    userId: string, 
    bankId: string
  ): Promise<PSD2AuthUrl> {
    // In a real implementation, this would:
    // 1. Call your backend to create a PSD2 authorization request
    // 2. Return the authorization URL from the bank
    // 3. User would be redirected to the bank's login page
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          authUrl: `https://api.${bankId}.nl/oauth/authorize?client_id=your_client_id&redirect_uri=${encodeURIComponent(window.location.origin + '/bank-callback')}&scope=accounts%20transactions&response_type=code&state=${Math.random().toString(36).substring(7)}`,
          state: Math.random().toString(36).substring(7),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        });
      }, 1000);
    });
  }

  // Complete PSD2 connection after user authorization
  static async completeBankConnection(
    userId: string,
    authorizationCode: string,
    state: string
  ): Promise<BankConnection> {
    // In a real implementation, this would:
    // 1. Exchange authorization code for access token
    // 2. Fetch account information
    // 3. Store connection in database
    // 4. Return connection details
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConnection: BankConnection = {
          id: Date.now().toString(),
          bankId: 'demo-bank',
          bankName: 'Demo Bank',
          accountId: 'NL91ABNA0417164300',
          accountName: 'Betaalrekening',
          accountType: 'checking',
          balance: 1000.00,
          currency: 'EUR',
          connectedAt: new Date().toISOString(),
          lastSync: new Date().toISOString(),
          status: 'active'
        };
        
        mockBankConnections.push(newConnection);
        resolve(newConnection);
      }, 1500);
    });
  }

  // Sync transactions from connected banks
  static async syncTransactions(
    userId: string,
    bankConnectionId: string
  ): Promise<BankSyncResult> {
    // In a real implementation, this would:
    // 1. Use stored access token to call bank's API
    // 2. Fetch new transactions since last sync
    // 3. Process and categorize transactions
    // 4. Store in database
    // 5. Update last sync timestamp
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransactions = Math.floor(Math.random() * 10) + 1;
        const updatedTransactions = Math.floor(Math.random() * 3);
        
        resolve({
          success: true,
          newTransactions,
          updatedTransactions,
          errors: [],
          lastSync: new Date().toISOString()
        });
      }, 2000);
    });
  }

  // Disconnect a bank
  static async disconnectBank(
    userId: string,
    bankConnectionId: string
  ): Promise<boolean> {
    // In a real implementation, this would:
    // 1. Revoke access token with the bank
    // 2. Remove connection from database
    // 3. Optionally delete associated data
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockBankConnections.findIndex(c => c.id === bankConnectionId);
        if (index !== -1) {
          mockBankConnections.splice(index, 1);
        }
        resolve(true);
      }, 500);
    });
  }

  // Get sync status for all connected banks
  static async getSyncStatus(userId: string): Promise<{
    totalConnections: number;
    activeConnections: number;
    lastSync: string;
    nextSync: string;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalConnections: mockBankConnections.length,
          activeConnections: mockBankConnections.filter(c => c.status === 'active').length,
          lastSync: mockBankConnections.length > 0 
            ? mockBankConnections[0].lastSync 
            : new Date().toISOString(),
          nextSync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        });
      }, 300);
    });
  }

  // Get available banks for connection
  static async getAvailableBanks(): Promise<Array<{
    id: string;
    name: string;
    logo: string;
    supported: boolean;
  }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'ing', name: 'ING Bank', logo: 'ING', supported: true },
          { id: 'rabobank', name: 'Rabobank', logo: 'RABO', supported: true },
          { id: 'abnamro', name: 'ABN AMRO', logo: 'ABN', supported: true },
          { id: 'bunq', name: 'Bunq', logo: 'BUNQ', supported: true },
          { id: 'sns', name: 'SNS Bank', logo: 'SNS', supported: true },
          { id: 'asn', name: 'ASN Bank', logo: 'ASN', supported: true },
          { id: 'triodos', name: 'Triodos Bank', logo: 'TRIODOS', supported: false },
          { id: 'knab', name: 'Knab', logo: 'KNAB', supported: false }
        ]);
      }, 500);
    });
  }

  // Validate PSD2 compliance
  static async validatePSD2Compliance(): Promise<{
    compliant: boolean;
    certificate: string;
    validUntil: string;
    features: string[];
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          compliant: true,
          certificate: 'PSD2-QWAC-2024-001',
          validUntil: '2025-12-31T23:59:59Z',
          features: [
            'Account Information Services (AIS)',
            'Payment Initiation Services (PIS)',
            'Strong Customer Authentication (SCA)',
            'Open Banking API v3.1'
          ]
        });
      }, 300);
    });
  }
}

// PSD2 Error handling
export class PSD2Error extends Error {
  constructor(
    message: string,
    public code: string,
    public bankId?: string
  ) {
    super(message);
    this.name = 'PSD2Error';
  }
}

// PSD2 Error codes
export const PSD2_ERROR_CODES = {
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  INSUFFICIENT_SCOPE: 'INSUFFICIENT_SCOPE',
  ACCOUNT_ACCESS_REVOKED: 'ACCOUNT_ACCESS_REVOKED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  BANK_UNAVAILABLE: 'BANK_UNAVAILABLE',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS'
} as const; 