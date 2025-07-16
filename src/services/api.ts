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
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  bank_transaction_id?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  period: 'monthly' | 'weekly' | 'yearly';
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  description?: string;
  created_at: string;
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
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Transaction operations
  static async getTransactions(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as Transaction[];
  }

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
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
      .select('*')
      .eq('user_id', userId)
      .order('category');
    
    if (error) throw error;
    
    // Calculate spent amounts from transactions for each budget
    const budgetsWithSpent = await Promise.all(
      (data as any[]).map(async (budget) => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const { data: transactions } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('category', budget.category)
          .gte('transaction_date', `${currentMonth}-01`)
          .lte('transaction_date', `${currentMonth}-31`)
          .lt('amount', 0); // Only expenses (negative amounts)
        
        const spent = transactions?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
        const remaining = budget.budget - spent;
        
        return {
          ...budget,
          spent,
          remaining
        };
      })
    );
    
    return budgetsWithSpent as Budget[];
  }

  static async createBudget(budget: Omit<Budget, 'id' | 'created_at' | 'spent' | 'remaining'>) {
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: budget.user_id,
        name: budget.name,
        category: budget.category,
        budget: budget.budget,
        period: budget.period || 'monthly'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Return with calculated spent and remaining
    return {
      ...data,
      spent: 0,
      remaining: budget.budget
    } as Budget;
  }

  static async updateBudget(id: string, updates: Partial<Budget>) {
    // Only update the fields that are actually stored in the database
    const { data, error } = await supabase
      .from('budgets')
      .update({
        name: updates.name,
        category: updates.category,
        budget: updates.budget,
        period: updates.period
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
      .eq('category', data.category)
      .gte('transaction_date', `${currentMonth}-01`)
      .lte('transaction_date', `${currentMonth}-31`)
      .lt('amount', 0);
    
    const spent = transactions?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    const remaining = data.budget - spent;
    
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
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SavingsGoal[];
  }

  static async createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert(goal)
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
      .select('*')
      .eq('user_id', userId)
      .gte('transaction_date', `${currentMonth}-01`)
      .lte('transaction_date', `${currentMonth}-31`);
    
    if (txError) throw txError;

    // Get budgets
    const { data: budgets, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);
    
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
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
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
} 