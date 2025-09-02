import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PSD2Connect } from './PSD2Connect';
import { Dashboard } from './Dashboard';
import { Navigation } from './Navigation';
import { Transaction, Budget, Goal, BankAccount } from '../services/api';
import { supabase } from '../supabase';
import apiService from '../services/api';

interface MainAppProps {
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load data from API
        const [transactionsRes, budgetsRes, goalsRes, accountsRes] = await Promise.all([
          apiService.getTransactions(),
          apiService.getBudgets(),
          apiService.getGoals(),
          apiService.getBankAccounts()
        ]);

        if (transactionsRes.success) setTransactions(transactionsRes.data);
        if (budgetsRes.success) setBudgets(budgetsRes.data);
        if (goalsRes.success) setGoals(goalsRes.data);
        if (accountsRes.success) setAccounts(accountsRes.data);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Kon data niet laden van de server');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePSD2Connect = (authUrl: string) => {
    Alert.alert(
      'Bank Verbinding',
      'Je wordt doorgestuurd naar je bank om de verbinding te autoriseren.',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'Doorgaan', onPress: () => {
          console.log('Opening:', authUrl);
          // Simulate successful connection
          setTimeout(() => {
            setIsConnected(true);
            Alert.alert('Succes!', 'Je bankrekening is succesvol verbonden.');
          }, 2000);
        }}
      ]
    );
  };

  const handlePSD2Success = (newAccounts: Account[]) => {
    setAccounts(newAccounts);
    setIsConnected(true);
    Alert.alert('Succes!', 'Je bankrekening is succesvol verbonden.');
  };

  const handlePSD2Error = (error: string) => {
    Alert.alert('Error', `Er is een fout opgetreden: ${error}`);
  };

  const renderContent = () => {
    if (loading) {
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
          <Dashboard
            transactions={transactions}
            budgets={budgets}
            totalBalance={accounts.reduce((sum, acc) => sum + acc.balance, 0)}
            monthlyIncome={transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}
            monthlyExpenses={transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)}
          />
        );
      case 'transactions':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>💳 Transacties</Text>
              <Text style={styles.subtitle}>Overzicht van al je uitgaven en inkomsten</Text>
            </View>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? '#10B981' : '#EF4444' }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'budgets':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>💰 Budgetten</Text>
              <Text style={styles.subtitle}>Houd je uitgaven onder controle</Text>
            </View>
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const status = budget.spent >= budget.limit ? 'over' : 
                            budget.spent >= budget.limit * 0.9 ? 'warning' : 'good';
              
              return (
                <View key={budget.id} style={styles.budgetItem}>
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetCategory}>{budget.category}</Text>
                    <Text style={styles.budgetAmount}>
                      €{budget.spent.toLocaleString()} / €{budget.limit.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.budgetProgress}>
                    <View style={[
                      styles.progressBar,
                      { width: `${Math.min(percentage, 100)}%` },
                      { backgroundColor: status === 'over' ? '#EF4444' : status === 'warning' ? '#F59E0B' : '#10B981' }
                    ]} />
                  </View>
                  <Text style={styles.budgetPercentage}>{percentage.toFixed(1)}%</Text>
                </View>
              );
            })}
          </ScrollView>
        );
      case 'goals':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>🎯 Doelen</Text>
              <Text style={styles.subtitle}>Stel je financiële doelen en behaal ze</Text>
            </View>
            {goals.map((goal) => {
              const percentage = (goal.current / goal.target) * 100;
              
              return (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalTarget}>€{goal.target.toLocaleString()}</Text>
                  </View>
                  <View style={styles.goalProgress}>
                    <View style={[
                      styles.progressBar,
                      { width: `${Math.min(percentage, 100)}%` },
                      { backgroundColor: '#10B981' }
                    ]} />
                  </View>
                  <Text style={styles.goalPercentage}>{percentage.toFixed(1)}%</Text>
                  <Text style={styles.goalCurrent}>€{goal.current.toLocaleString()} gespaard</Text>
                </View>
              );
            })}
          </ScrollView>
        );
      case 'profile':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>👤 Profiel</Text>
              <Text style={styles.subtitle}>Beheer je account en instellingen</Text>
            </View>
            
            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Account Informatie</Text>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Email</Text>
                <Text style={styles.profileValue}>{user?.email || 'Onbekend'}</Text>
              </View>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Lid sinds</Text>
                <Text style={styles.profileValue}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('nl-NL') : 'Onbekend'}
                </Text>
              </View>
            </View>

            <View style={styles.profileSection}>
              <Text style={styles.sectionTitle}>Bank Integratie</Text>
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Status</Text>
                <Text style={[styles.profileValue, { color: isConnected ? '#10B981' : '#EF4444' }]}>
                  {isConnected ? 'Verbonden' : 'Niet verbonden'}
                </Text>
              </View>
              {!isConnected && (
                <PSD2Connect
                  onConnect={handlePSD2Connect}
                  onSuccess={handlePSD2Success}
                  onError={handlePSD2Error}
                />
              )}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutButtonText}>Uitloggen</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      <Navigation activeTab={activeTab} onTabPress={setActiveTab} />
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
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#64748b',
  },
  budgetProgress: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetPercentage: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  goalItem: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  goalTarget: {
    fontSize: 14,
    color: '#64748b',
  },
  goalProgress: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalPercentage: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginBottom: 4,
  },
  goalCurrent: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  profileSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  profileValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
