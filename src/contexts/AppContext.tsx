import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ApiService, Transaction, Budget, SavingsGoal, Category } from '../services/api';
import { useAuth } from './AuthContext';

// State interface
interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'SET_SAVINGS_GOALS'; payload: SavingsGoal[] }
  | { type: 'ADD_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'UPDATE_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'DELETE_SAVINGS_GOAL'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] };

// Initial state
const initialState: AppState = {
  transactions: [],
  budgets: [],
  savingsGoals: [],
  categories: [],
  loading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(b => 
          b.id === action.payload.id ? action.payload : b
        ),
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.payload),
      };
    case 'SET_SAVINGS_GOALS':
      return { ...state, savingsGoals: action.payload };
    case 'ADD_SAVINGS_GOAL':
      return { ...state, savingsGoals: [action.payload, ...state.savingsGoals] };
    case 'UPDATE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map(g => 
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case 'DELETE_SAVINGS_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.filter(g => g.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

// Context
interface AppContextType extends AppState {
  user: any; // Add user property
  dispatch: React.Dispatch<AppAction>;
  loadUserData: () => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  createBudget: (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'current_spent'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  createSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at' | 'progress_percentage'>) => Promise<void>;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  // Load user data
  const loadUserData = async () => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const [transactions, budgets, savingsGoals, categories] = await Promise.all([
        ApiService.getTransactions(user.id),
        ApiService.getBudgets(user.id),
        ApiService.getSavingsGoals(user.id),
        ApiService.getCategories(),
      ]);
      
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
      dispatch({ type: 'SET_BUDGETS', payload: budgets });
      dispatch({ type: 'SET_SAVINGS_GOALS', payload: savingsGoals });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Transaction actions
  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newTransaction = await ApiService.createTransaction({
        ...transaction,
        user_id: user.id,
      });
      dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const updatedTransaction = await ApiService.updateTransaction(id, updates);
      dispatch({ type: 'UPDATE_TRANSACTION', payload: updatedTransaction });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await ApiService.deleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  // Budget actions
  const createBudget = async (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at' | 'current_spent'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newBudget = await ApiService.createBudget({
        ...budget,
        user_id: user.id,
      });
      dispatch({ type: 'ADD_BUDGET', payload: newBudget });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const updatedBudget = await ApiService.updateBudget(id, updates);
      dispatch({ type: 'UPDATE_BUDGET', payload: updatedBudget });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await ApiService.deleteBudget(id);
      dispatch({ type: 'DELETE_BUDGET', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  // Savings goal actions
  const createSavingsGoal = async (goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at' | 'progress_percentage'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newGoal = await ApiService.createSavingsGoal({
        ...goal,
        user_id: user.id,
      });
      dispatch({ type: 'ADD_SAVINGS_GOAL', payload: newGoal });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    try {
      const updatedGoal = await ApiService.updateSavingsGoal(id, updates);
      dispatch({ type: 'UPDATE_SAVINGS_GOAL', payload: updatedGoal });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    try {
      await ApiService.deleteSavingsGoal(id);
      dispatch({ type: 'DELETE_SAVINGS_GOAL', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  const contextValue: AppContextType = {
    ...state,
    user, // Add user to context value
    dispatch,
    loadUserData,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createBudget,
    updateBudget,
    deleteBudget,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 