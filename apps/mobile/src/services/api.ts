const API_BASE_URL = 'http://localhost:4000';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: string;
}

export interface BankAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Health check
  async getHealth(): Promise<ApiResponse<any>> {
    return this.request('/health');
  }

  // Transactions
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.request('/api/transactions');
  }

  // Budgets
  async getBudgets(): Promise<ApiResponse<Budget[]>> {
    return this.request('/api/budgets');
  }

  // Goals
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    return this.request('/api/goals');
  }

  // Bank accounts
  async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    return this.request('/api/bank/accounts');
  }

  // AI chat
  async sendMessage(message: string): Promise<ApiResponse<any>> {
    return this.request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Bank connection
  async connectBank(provider: string, redirectUri: string, permissions: string[]): Promise<ApiResponse<any>> {
    return this.request('/api/bank/connect', {
      method: 'POST',
      body: JSON.stringify({ provider, redirectUri, permissions }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
