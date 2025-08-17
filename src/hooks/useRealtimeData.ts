import { useState, useEffect, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Transaction, Budget, SavingsGoal } from '../types';

interface RealtimeData {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const useRealtimeData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<RealtimeData>({
    transactions: [],
    budgets: [],
    savingsGoals: [],
    loading: true,
    error: null,
    lastUpdate: null,
  });

  const [channels, setChannels] = useState<RealtimeChannel[]>([]);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!user) return;

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Load transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(100);

      if (transactionsError) throw transactionsError;

      // Load budgets
      const { data: budgets, error: budgetsError } = await supabase
        .from('budgets')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (budgetsError) throw budgetsError;

      // Load savings goals
      const { data: savingsGoals, error: goalsError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (goalsError) throw goalsError;

      setData({
        transactions: transactions || [],
        budgets: budgets || [],
        savingsGoals: savingsGoals || [],
        loading: false,
        error: null,
        lastUpdate: new Date(),
      });

    } catch (error) {
      console.error('Error loading initial data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      }));
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const newChannels: RealtimeChannel[] = [];

    // Transactions subscription
    const transactionsChannel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Transaction change:', payload);
          
          setData(prev => {
            let newTransactions = [...prev.transactions];
            
            switch (payload.eventType) {
              case 'INSERT':
                // Add new transaction to the beginning
                newTransactions.unshift(payload.new as Transaction);
                break;
              
              case 'UPDATE':
                // Update existing transaction
                const updateIndex = newTransactions.findIndex(t => t.id === payload.new.id);
                if (updateIndex !== -1) {
                  newTransactions[updateIndex] = payload.new as Transaction;
                }
                break;
              
              case 'DELETE':
                // Remove deleted transaction
                newTransactions = newTransactions.filter(t => t.id !== payload.old.id);
                break;
            }
            
            return {
              ...prev,
              transactions: newTransactions.slice(0, 100), // Keep only latest 100
              lastUpdate: new Date(),
            };
          });
        }
      )
      .subscribe();

    newChannels.push(transactionsChannel);

    // Budgets subscription
    const budgetsChannel = supabase
      .channel('budgets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Budget change:', payload);
          
          setData(prev => {
            let newBudgets = [...prev.budgets];
            
            switch (payload.eventType) {
              case 'INSERT':
                if ((payload.new as any).is_active) {
                  newBudgets.push(payload.new as Budget);
                }
                break;
              
              case 'UPDATE':
                const updateIndex = newBudgets.findIndex(b => b.id === payload.new.id);
                if (updateIndex !== -1) {
                  if ((payload.new as any).is_active) {
                    newBudgets[updateIndex] = payload.new as Budget;
                  } else {
                    // Remove if deactivated
                    newBudgets = newBudgets.filter(b => b.id !== payload.new.id);
                  }
                } else if ((payload.new as any).is_active) {
                  // Add if activated
                  newBudgets.push(payload.new as Budget);
                }
                break;
              
              case 'DELETE':
                newBudgets = newBudgets.filter(b => b.id !== payload.old.id);
                break;
            }
            
            return {
              ...prev,
              budgets: newBudgets,
              lastUpdate: new Date(),
            };
          });
        }
      )
      .subscribe();

    newChannels.push(budgetsChannel);

    // Savings goals subscription
    const goalsChannel = supabase
      .channel('savings_goals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'savings_goals',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Savings goal change:', payload);
          
          setData(prev => {
            let newGoals = [...prev.savingsGoals];
            
            switch (payload.eventType) {
              case 'INSERT':
                if ((payload.new as any).is_active) {
                  newGoals.push(payload.new as SavingsGoal);
                }
                break;
              
              case 'UPDATE':
                const updateIndex = newGoals.findIndex(g => g.id === payload.new.id);
                if (updateIndex !== -1) {
                  if ((payload.new as any).is_active) {
                    newGoals[updateIndex] = payload.new as SavingsGoal;
                  } else {
                    // Remove if deactivated
                    newGoals = newGoals.filter(g => g.id !== payload.new.id);
                  }
                } else if ((payload.new as any).is_active) {
                  // Add if activated
                  newGoals.push(payload.new as SavingsGoal);
                }
                break;
              
              case 'DELETE':
                newGoals = newGoals.filter(g => g.id !== payload.old.id);
                break;
            }
            
            return {
              ...prev,
              savingsGoals: newGoals,
              lastUpdate: new Date(),
            };
          });
        }
      )
      .subscribe();

    newChannels.push(goalsChannel);

    setChannels(newChannels);

    // Cleanup function
    return () => {
      newChannels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user]);

  // Load initial data when user changes
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [channels]);

  return {
    ...data,
    refresh,
    isConnected: channels.length > 0,
  };
};