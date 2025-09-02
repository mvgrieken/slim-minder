export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'month' | 'week';
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type: 'save' | 'reduce';
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings';
  currency: string;
}

export class MockDataService {
  private static instance: MockDataService;
  
  private transactions: Transaction[] = [
    {
      id: '1',
      description: 'Albert Heijn',
      amount: 45.67,
      category: 'Boodschappen',
      date: '2025-08-31',
      type: 'expense'
    },
    {
      id: '2',
      description: 'Salaris',
      amount: 2500.00,
      category: 'Inkomen',
      date: '2025-08-28',
      type: 'income'
    },
    {
      id: '3',
      description: 'Shell Tankstation',
      amount: 65.00,
      category: 'Transport',
      date: '2025-08-30',
      type: 'expense'
    },
    {
      id: '4',
      description: 'Netflix',
      amount: 15.99,
      category: 'Entertainment',
      date: '2025-08-29',
      type: 'expense'
    },
    {
      id: '5',
      description: 'H&M',
      amount: 89.50,
      category: 'Kleding',
      date: '2025-08-27',
      type: 'expense'
    },
    {
      id: '6',
      description: 'Restaurant De Waag',
      amount: 125.00,
      category: 'Uit eten',
      date: '2025-08-26',
      type: 'expense'
    },
    {
      id: '7',
      description: 'OV-Chipkaart',
      amount: 50.00,
      category: 'Transport',
      date: '2025-08-25',
      type: 'expense'
    },
    {
      id: '8',
      description: 'Kruidvat',
      amount: 23.45,
      category: 'Boodschappen',
      date: '2025-08-24',
      type: 'expense'
    }
  ];

  private budgets: Budget[] = [
    {
      id: '1',
      category: 'Boodschappen',
      limit: 400,
      spent: 345.67,
      period: 'month'
    },
    {
      id: '2',
      category: 'Transport',
      limit: 200,
      spent: 115.00,
      period: 'month'
    },
    {
      id: '3',
      category: 'Entertainment',
      limit: 150,
      spent: 140.99,
      period: 'month'
    },
    {
      id: '4',
      category: 'Uit eten',
      limit: 300,
      spent: 125.00,
      period: 'month'
    }
  ];

  private goals: Goal[] = [
    {
      id: '1',
      title: 'Nieuwe Laptop',
      targetAmount: 1200,
      currentAmount: 450,
      deadline: '2025-12-31',
      type: 'save'
    },
    {
      id: '2',
      title: 'Vakantie Spanje',
      targetAmount: 800,
      currentAmount: 320,
      deadline: '2025-06-30',
      type: 'save'
    },
    {
      id: '3',
      title: 'Uber Eats Uitgaven',
      targetAmount: 200,
      currentAmount: 150,
      deadline: '2025-09-30',
      type: 'reduce'
    }
  ];

  private accounts: Account[] = [
    {
      id: '1',
      name: 'ING Bank',
      balance: 1250.50,
      type: 'checking',
      currency: 'EUR'
    },
    {
      id: '2',
      name: 'ING Spaarrekening',
      balance: 5000.00,
      type: 'savings',
      currency: 'EUR'
    }
  ];

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  public getTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getBudgets(): Budget[] {
    return [...this.budgets];
  }

  public getGoals(): Goal[] {
    return [...this.goals];
  }

  public getAccounts(): Account[] {
    return [...this.accounts];
  }

  public getTotalBalance(): number {
    return this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  public getMonthlyIncome(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  public getMonthlyExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  public addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  public addBudget(budget: Omit<Budget, 'id'>): Budget {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString()
    };
    this.budgets.push(newBudget);
    return newBudget;
  }

  public addGoal(goal: Omit<Goal, 'id'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString()
    };
    this.goals.push(newGoal);
    return newGoal;
  }

  public updateBudget(id: string, updates: Partial<Budget>): Budget | null {
    const index = this.budgets.findIndex(b => b.id === id);
    if (index !== -1) {
      this.budgets[index] = { ...this.budgets[index], ...updates };
      return this.budgets[index];
    }
    return null;
  }

  public updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const index = this.goals.findIndex(g => g.id === id);
    if (index !== -1) {
      this.goals[index] = { ...this.goals[index], ...updates };
      return this.goals[index];
    }
    return null;
  }

  public getTransactionsByCategory(category: string): Transaction[] {
    return this.transactions.filter(t => t.category === category);
  }

  public getTransactionsByDateRange(startDate: string, endDate: string): Transaction[] {
    return this.transactions.filter(t => {
      const date = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });
  }

  public getCategoryTotals(): { [key: string]: number } {
    const totals: { [key: string]: number } = {};
    this.transactions.forEach(t => {
      if (t.type === 'expense') {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    });
    return totals;
  }
}

