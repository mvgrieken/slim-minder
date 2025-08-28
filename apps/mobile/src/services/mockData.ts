/**
 * Mock Data Service for Development
 * 
 * Provides realistic mock data for testing and development
 * when backend services are not available.
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface MockTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface MockBudget {
  id: string;
  user_id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'month' | 'week';
  start_date: string;
}

export interface MockGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  category: string;
}

export interface MockBadge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  earned: boolean;
  earned_at?: string;
  icon: string;
}

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: 'Demo Gebruiker',
    email: 'demo@slimminder.nl',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Categories
export const mockCategories = [
  'Boodschappen',
  'Transport',
  'Restaurants',
  'Entertainment',
  'Kleding',
  'Gezondheid',
  'Educatie',
  'Sport',
  'Cadeaus',
  'Overig'
];

// Mock Transactions
export const mockTransactions: MockTransaction[] = [
  {
    id: 'tx-1',
    user_id: 'user-1',
    amount: -45.67,
    description: 'Albert Heijn',
    category: 'Boodschappen',
    date: '2024-01-15',
    type: 'expense'
  },
  {
    id: 'tx-2',
    user_id: 'user-1',
    amount: -12.50,
    description: 'NS Reizen',
    category: 'Transport',
    date: '2024-01-15',
    type: 'expense'
  },
  {
    id: 'tx-3',
    user_id: 'user-1',
    amount: -28.90,
    description: 'McDonald\'s',
    category: 'Restaurants',
    date: '2024-01-14',
    type: 'expense'
  },
  {
    id: 'tx-4',
    user_id: 'user-1',
    amount: 2500.00,
    description: 'Salaris',
    category: 'Inkomen',
    date: '2024-01-01',
    type: 'income'
  },
  {
    id: 'tx-5',
    user_id: 'user-1',
    amount: -15.99,
    description: 'Netflix',
    category: 'Entertainment',
    date: '2024-01-13',
    type: 'expense'
  },
  {
    id: 'tx-6',
    user_id: 'user-1',
    amount: -67.89,
    description: 'Etos - Persoonlijke verzorging',
    category: 'Gezondheid',
    date: '2024-01-12',
    type: 'expense'
  },
  {
    id: 'tx-7',
    user_id: 'user-1',
    amount: -123.45,
    description: 'Zara',
    category: 'Kleding',
    date: '2024-01-11',
    type: 'expense'
  },
  {
    id: 'tx-8',
    user_id: 'user-1',
    amount: -8.50,
    description: 'Starbucks',
    category: 'Restaurants',
    date: '2024-01-11',
    type: 'expense'
  },
  {
    id: 'tx-9',
    user_id: 'user-1',
    amount: -34.99,
    description: 'Basic Fit',
    category: 'Sport',
    date: '2024-01-10',
    type: 'expense'
  },
  {
    id: 'tx-10',
    user_id: 'user-1',
    amount: -89.76,
    description: 'Jumbo',
    category: 'Boodschappen',
    date: '2024-01-09',
    type: 'expense'
  }
];

// Mock Budgets
export const mockBudgets: MockBudget[] = [
  {
    id: 'budget-1',
    user_id: 'user-1',
    category: 'Boodschappen',
    limit: 400.00,
    spent: 135.43,
    period: 'month',
    start_date: '2024-01-01'
  },
  {
    id: 'budget-2',
    user_id: 'user-1',
    category: 'Transport',
    limit: 150.00,
    spent: 67.50,
    period: 'month',
    start_date: '2024-01-01'
  },
  {
    id: 'budget-3',
    user_id: 'user-1',
    category: 'Restaurants',
    limit: 200.00,
    spent: 187.40,
    period: 'month',
    start_date: '2024-01-01'
  },
  {
    id: 'budget-4',
    user_id: 'user-1',
    category: 'Entertainment',
    limit: 75.00,
    spent: 15.99,
    period: 'month',
    start_date: '2024-01-01'
  },
  {
    id: 'budget-5',
    user_id: 'user-1',
    category: 'Kleding',
    limit: 300.00,
    spent: 123.45,
    period: 'month',
    start_date: '2024-01-01'
  }
];

// Mock Goals
export const mockGoals: MockGoal[] = [
  {
    id: 'goal-1',
    user_id: 'user-1',
    title: 'Noodfonds opbouwen',
    target_amount: 5000.00,
    current_amount: 3200.00,
    category: 'Sparen'
  },
  {
    id: 'goal-2',
    user_id: 'user-1',
    title: 'Vakantie naar Italië',
    target_amount: 2500.00,
    current_amount: 1200.00,
    deadline: '2024-06-01',
    category: 'Vakantie'
  },
  {
    id: 'goal-3',
    user_id: 'user-1',
    title: 'Nieuwe laptop',
    target_amount: 1500.00,
    current_amount: 450.00,
    deadline: '2024-03-15',
    category: 'Technologie'
  }
];

// Mock Badges
export const mockBadges: MockBadge[] = [
  {
    id: 'badge-1',
    user_id: 'user-1',
    name: 'Budget Bewaker',
    description: 'Een hele maand binnen je budget gebleven',
    earned: true,
    earned_at: '2024-01-15',
    icon: '🏆'
  },
  {
    id: 'badge-2',
    user_id: 'user-1',
    name: 'Spaar Starter',
    description: 'Je eerste spaardoel behaald',
    earned: true,
    earned_at: '2024-01-20',
    icon: '💰'
  },
  {
    id: 'badge-3',
    user_id: 'user-1',
    name: 'Streak Master',
    description: '7 dagen op rij uitgaven bijgehouden',
    earned: true,
    earned_at: '2024-01-25',
    icon: '🔥'
  },
  {
    id: 'badge-4',
    user_id: 'user-1',
    name: 'Categorie Koning',
    description: '50 transacties correct gecategoriseerd',
    earned: false,
    icon: '👑'
  },
  {
    id: 'badge-5',
    user_id: 'user-1',
    name: 'Budget Expert',
    description: '3 maanden achter elkaar binnen budget',
    earned: false,
    icon: '🎯'
  }
];

// Mock AI Chat Messages
export const mockAIResponses = [
  "Hallo! Ik ben je persoonlijke budgetcoach. Hoe kan ik je helpen met je financiën?",
  "Dat is een goede vraag! Op basis van je uitgavenpatroon zou ik aanraden om je restaurant budget te verlagen en meer thuis te koken.",
  "Ik zie dat je deze maand al 94% van je restaurant budget hebt gebruikt. Wil je dat we kijken naar mogelijke besparingen?",
  "Goed bezig! Je bent deze maand binnen budget gebleven voor transport. Misschien kunnen we dat geld reserveren voor je vakantiedoel?",
  "Laat me je helpen met het maken van een realistisch budget voor volgende maand. Wat zijn je vaste kosten?",
  "Je noodfonds groeit goed! Met €3.200 heb je al 64% van je doel bereikt. Wil je de maandelijkse bijdrage verhogen?",
  "Ik kan je tips geven over verschillende spaarstrategieën. Ben je geïnteresseerd in automatisch sparen of handmatig bijdragen?",
  "Je uitgavenpatroon laat zien dat je het meeste geld uitgeeft aan boodschappen en restaurants. Wil je tips om hier op te besparen?",
  "Geweldig! Je hebt de 'Budget Bewaker' badge verdiend door een hele maand binnen budget te blijven. Ga zo door!",
  "Je bent op de goede weg naar je vakantiedoel. Met nog €1.300 te gaan, kun je dit bereiken door €260 per maand opzij te zetten."
];

// Mock API Service
export const mockDataService = {
  // User operations
  async getUser(id: string): Promise<MockUser | null> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return mockUsers.find(user => user.id === id) || null;
  },

  // Transaction operations
  async getTransactions(userId: string, limit: number = 50): Promise<MockTransaction[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTransactions
      .filter(tx => tx.user_id === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  async addTransaction(transaction: Omit<MockTransaction, 'id'>): Promise<MockTransaction> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTransaction = {
      ...transaction,
      id: `tx-${Date.now()}`
    };
    mockTransactions.unshift(newTransaction);
    return newTransaction;
  },

  // Budget operations
  async getBudgets(userId: string): Promise<MockBudget[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockBudgets.filter(budget => budget.user_id === userId);
  },

  async updateBudget(id: string, updates: Partial<MockBudget>): Promise<MockBudget | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const budgetIndex = mockBudgets.findIndex(b => b.id === id);
    if (budgetIndex === -1) return null;
    
    mockBudgets[budgetIndex] = { ...mockBudgets[budgetIndex], ...updates };
    return mockBudgets[budgetIndex];
  },

  // Goal operations
  async getGoals(userId: string): Promise<MockGoal[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockGoals.filter(goal => goal.user_id === userId);
  },

  async addGoal(goal: Omit<MockGoal, 'id'>): Promise<MockGoal> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    };
    mockGoals.push(newGoal);
    return newGoal;
  },

  // Badge operations
  async getBadges(userId: string): Promise<MockBadge[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBadges.filter(badge => badge.user_id === userId);
  },

  // AI Chat
  async getAIResponse(message: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing
    const responses = mockAIResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  },

  // Analytics
  async getMonthlySpending(userId: string, year: number, month: number): Promise<{ category: string; amount: number }[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const monthTransactions = mockTransactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.user_id === userId && 
               txDate.getFullYear() === year && 
               txDate.getMonth() === month - 1 &&
               tx.type === 'expense';
      });

    const categoryTotals = monthTransactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    }));
  }
};

export default mockDataService;