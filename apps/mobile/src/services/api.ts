const API_BASE_URL = 'http://localhost:4000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-sm-user-id': 'mobile-user',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  // PSD2 Bank Connection
  async connectBank(provider: string, redirectUrl: string, permissions: string[]) {
    return this.request<{ authUrl: string }>('/bank/connect', {
      method: 'POST',
      body: JSON.stringify({
        provider,
        redirectUrl,
        permissions,
      }),
    });
  }

  async getBankAccounts() {
    return this.request<any[]>('/bank/accounts');
  }

  async syncBankTransactions() {
    return this.request<any[]>('/bank/sync', {
      method: 'POST',
    });
  }

  // Transactions
  async getTransactions(params?: {
    from?: string;
    to?: string;
    categoryId?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const endpoint = `/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  async createTransaction(transaction: {
    description: string;
    amount: number;
    categoryId?: string;
    date?: string;
    merchant?: string;
  }) {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: string, updates: {
    description?: string;
    categoryId?: string;
    merchant?: string;
  }) {
    return this.request<any>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(params?: { from?: string; to?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);

    const endpoint = `/transactions/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<any>(endpoint);
  }

  // Budgets
  async getBudgets() {
    return this.request<any[]>('/budgets');
  }

  async createBudget(budget: {
    categoryId: string;
    limit: number;
    period?: string;
    startsOn?: string;
  }) {
    return this.request<any>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async updateBudget(id: string, updates: {
    limit?: number;
    period?: string;
    startsOn?: string;
  }) {
    return this.request<any>(`/budgets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteBudget(id: string) {
    return this.request<void>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  async getBudgetAlerts(threshold?: number) {
    const queryParams = new URLSearchParams();
    if (threshold) queryParams.append('threshold', threshold.toString());

    const endpoint = `/budgets/alerts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async createCategory(category: { name: string; icon?: string }) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, updates: { name?: string; icon?: string }) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCategory(id: string) {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // AI Coach
  async askAI(question: string) {
    return this.request<any>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  // Health Check
  async healthCheck() {
    return this.request<any>('/health');
  }
}

export const apiService = new ApiService();
