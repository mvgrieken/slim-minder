import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { Navigation } from './Navigation';
import { OfflineIndicator } from './OfflineIndicator';
import { DashboardContainer } from './dashboard/DashboardContainer';
import { TransactionsContainer } from './transactions/TransactionsContainer';
import { BudgetsContainer } from './budgets/BudgetsContainer';
import { GoalsContainer } from './goals/GoalsContainer';
import { ProfileContainer } from './profile/ProfileContainer';
import { Transaction, Budget, Goal, BankAccount } from '../services/api';
import { supabase } from '../supabase';
import { handleApiError } from '../utils/errorHandler';
import { useTransactions, useBudgets, useGoals, useBankAccounts } from '../hooks/useOfflineData';

// Add missing Account type
interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

interface MainAppProps {
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Use offline data hooks
  const transactionsHook = useTransactions();
  const budgetsHook = useBudgets();
  const goalsHook = useGoals();
  const accountsHook = useBankAccounts();

  // Extract data and loading states
  const transactions: Transaction[] = (transactionsHook.data as Transaction[]) || [];
  const budgets: Budget[] = (budgetsHook.data as Budget[]) || [];
  const goals: Goal[] = (goalsHook.data as Goal[]) || [];
  const accounts: BankAccount[] = (accountsHook.data as BankAccount[]) || [];
  
  const isLoading = transactionsHook.isLoading || budgetsHook.isLoading || 
                   goalsHook.isLoading || accountsHook.isLoading;

  const isOnline = transactionsHook.isOnline && budgetsHook.isOnline && 
                   goalsHook.isOnline && accountsHook.isOnline;

  // Callback functions
  const handlePSD2Connect = useCallback((authUrl: string) => {
    setIsConnected(true);
  }, []);

  const handlePSD2Success = useCallback((newAccounts: Account[]) => {
    setIsConnected(true);
  }, []);

  const handlePSD2Error = useCallback((error: string) => {
    console.error('PSD2 Error:', error);
  }, []);

  const handleTabPress = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleRefresh = useCallback(() => {
    transactionsHook.refreshData();
    budgetsHook.refreshData();
    goalsHook.refreshData();
    accountsHook.refreshData();
  }, [transactionsHook, budgetsHook, goalsHook, accountsHook]);

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
        handleApiError(error);
      }
    };

    getUser();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Data laden...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardContainer
            transactions={transactions}
            budgets={budgets}
            accounts={accounts}
            onRefresh={handleRefresh}
            refreshing={isLoading}
          />
        );
      case 'transactions':
        return <TransactionsContainer transactions={transactions} />;
      case 'budgets':
        return <BudgetsContainer budgets={budgets} />;
      case 'goals':
        return <GoalsContainer goals={goals} />;
      case 'profile':
        return (
          <ProfileContainer
            user={user}
            isConnected={isConnected}
            onPSD2Connect={handlePSD2Connect}
            onPSD2Success={handlePSD2Success}
            onPSD2Error={handlePSD2Error}
            onLogout={onLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <OfflineIndicator isOnline={isOnline} />
      <View style={styles.content}>
        {renderContent()}
      </View>
      <Navigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
  },
});
