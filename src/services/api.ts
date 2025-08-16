import { createClient } from '@supabase/supabase-js';

// Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  bank_connection_id?: string;
  transaction_id?: string;
  amount: number;
  currency: string;
  description: string;
  category_id?: string;
  subcategory?: string;
  transaction_date: string;
  processed_date?: string;
  merchant?: string;
  is_recurring?: boolean;
  confidence_score?: number;
  is_verified?: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    color: string;
    icon: string;
  };
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  alert_threshold: number;
  current_spent: number;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    color: string;
    icon: string;
  };
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  is_active: boolean;
  auto_save_enabled?: boolean;
  auto_save_amount?: number;
  progress_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  parent_id?: string;
  is_income: boolean;
  is_system: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder_key';

// Check if environment variables are properly set
if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables are not set!');
  console.warn('Please create a .env file with:');
  console.warn('REACT_APP_SUPABASE_URL=your_supabase_project_url');
  console.warn('REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// API Service class
export class ApiService {
  // User operations
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  static async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Category operations
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data as Category[];
  }

  // Transaction operations
  static async getTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(name, color, icon)
      `)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as Transaction[];
  }

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: transaction.user_id,
        bank_connection_id: transaction.bank_connection_id,
        transaction_id: transaction.transaction_id || `manual_${Date.now()}`,
        amount: transaction.amount,
        currency: transaction.currency || 'EUR',
        description: transaction.description,
        category_id: transaction.category_id,
        subcategory: transaction.subcategory,
        transaction_date: transaction.transaction_date,
        processed_date: transaction.processed_date || new Date().toISOString(),
        merchant: transaction.merchant,
        is_recurring: transaction.is_recurring || false,
        confidence_score: transaction.confidence_score || 1.0,
        is_verified: transaction.is_verified || true,
        metadata: transaction.metadata || {}
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Transaction;
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Transaction;
  }

  static async deleteTransaction(id: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Budget operations
  static async getBudgets(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select(`
        *,
        categories(name, color, icon)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    
    // Calculate spent amounts from transactions for each budget
    const budgetsWithSpent = await Promise.all(
      (data as any[]).map(async (budget) => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('category_id', budget.category_id)
          .gte('transaction_date', `${currentMonth}-01`)
          .lte('transaction_date', `${currentMonth}-31`)
          .lt('amount', 0); // Only expenses (negative amounts)
        
        const spent = transactions?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
        const remaining = budget.amount - spent;
        
        return {
          ...budget,
          spent,
          remaining
        };
      })
    );
    
    return budgetsWithSpent as Budget[];
  }

  static async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'current_spent'>) {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: budget.user_id,
        category_id: budget.category_id,
        name: budget.name,
        amount: budget.amount,
        period: budget.period || 'MONTHLY',
        start_date: budget.start_date,
        end_date: budget.end_date,
        is_active: budget.is_active || true,
        alert_threshold: budget.alert_threshold || 0.8,
        current_spent: 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Return with calculated spent and remaining
    return {
      ...data,
      spent: 0,
      remaining: budget.amount
    } as Budget;
  }

  static async updateBudget(id: string, updates: Partial<Budget>) {
    // Only update the fields that are actually stored in the database
    const { data, error } = await supabase
      .from('budgets')
      .update({
        category_id: updates.category_id,
        name: updates.name,
        amount: updates.amount,
        period: updates.period,
        start_date: updates.start_date,
        end_date: updates.end_date,
        is_active: updates.is_active,
        alert_threshold: updates.alert_threshold
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Recalculate spent and remaining
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', data.user_id)
      .eq('category_id', data.category_id)
      .gte('transaction_date', `${currentMonth}-01`)
      .lte('transaction_date', `${currentMonth}-31`)
      .lt('amount', 0);
    
    const spent = transactions?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    const remaining = data.amount - spent;
    
    return {
      ...data,
      spent,
      remaining
    } as Budget;
  }

  static async deleteBudget(id: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Savings goals operations
  static async getSavingsGoals(userId: string) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SavingsGoal[];
  }

  static async createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at' | 'progress_percentage'>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        user_id: goal.user_id,
        name: goal.name,
        description: goal.description,
        target_amount: goal.target_amount,
        current_amount: goal.current_amount || 0,
        target_date: goal.target_date,
        category: goal.category,
        priority: goal.priority || 'MEDIUM',
        is_active: goal.is_active || true,
        auto_save_enabled: goal.auto_save_enabled || false,
        auto_save_amount: goal.auto_save_amount
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as SavingsGoal;
  }

  static async updateSavingsGoal(id: string, updates: Partial<SavingsGoal>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SavingsGoal;
  }

  static async deleteSavingsGoal(id: string) {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Dashboard analytics
  static async getDashboardStats(userId: string, month?: string) {
    const currentMonth = month || new Date().toISOString().slice(0, 7);
    
    // Get transactions for current month
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(name, color, icon)
      `)
      .eq('user_id', userId)
      .gte('transaction_date', `${currentMonth}-01`)
      .lte('transaction_date', `${currentMonth}-31`);
    
    if (txError) throw txError;

    // Get budgets
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select(`
        *,
        categories(name, color, icon)
      `)
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (budgetError) throw budgetError;

    // Calculate stats
    const totalIncome = transactions
      ?.filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0) || 0;
    
    const totalExpenses = transactions
      ?.filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
    
    const totalSavings = totalIncome - totalExpenses;

    // Calculate category spending
    const categorySpending = transactions
      ?.filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const categoryName = (t as any).categories?.name || t.category_id || 'Onbekend';
        acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>) || {};

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      categorySpending,
      budgets: budgets || [],
      transactions: transactions || []
    };
  }

  // Bank connection operations
  static async getBankConnections(userId: string) {
    const { data, error } = await supabase
      .from('bank_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createBankConnection(connection: any) {
    const { data, error } = await supabase
      .from('bank_connections')
      .insert(connection)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateBankConnection(id: string, updates: any) {
    const { data, error } = await supabase
      .from('bank_connections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteBankConnection(id: string) {
    const { error } = await supabase
      .from('bank_connections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Gamification operations
  static async getGamificationData(userId: string) {
    const { data, error } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateGamificationData(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('gamification')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // AI conversations
  static async saveAIConversation(conversation: any) {
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert(conversation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getAIConversations(userId: string, sessionId?: string) {
    let query = supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
} 