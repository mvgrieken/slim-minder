import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { PSD2Connect } from './src/components/PSD2Connect';
import { Dashboard } from './src/components/Dashboard';
import { Navigation } from './src/components/Navigation';
import { MockDataService, Transaction, Budget, Goal, Account } from './src/services/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const mockDataService = MockDataService.getInstance();

  useEffect(() => {
    // Load initial data
    setTransactions(mockDataService.getTransactions());
    setBudgets(mockDataService.getBudgets());
    setGoals(mockDataService.getGoals());
    setAccounts(mockDataService.getAccounts());
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
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            budgets={budgets}
            totalBalance={mockDataService.getTotalBalance()}
            monthlyIncome={mockDataService.getMonthlyIncome()}
            monthlyExpenses={mockDataService.getMonthlyExpenses()}
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
              const statusColor = status === 'over' ? '#EF4444' : 
                                 status === 'warning' ? '#F59E0B' : '#10B981';
              
              return (
                <View key={budget.id} style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetCategory}>{budget.category}</Text>
                    <Text style={[styles.budgetStatus, { color: statusColor }]}>
                      {status === 'over' ? 'Overschreden' : 
                       status === 'warning' ? 'Bijna op' : 'Op schema'}
                    </Text>
                  </View>
                  <View style={styles.budgetProgressBar}>
                    <View 
                      style={[
                        styles.budgetProgressFill, 
                        { 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: statusColor
                        }
                      ]} 
                    />
                  </View>
                  <View style={styles.budgetAmounts}>
                    <Text style={styles.budgetSpent}>€{budget.spent.toLocaleString()}</Text>
                    <Text style={styles.budgetLimit}>/ €{budget.limit.toLocaleString()}</Text>
                  </View>
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
              <Text style={styles.subtitle}>Bereik je financiële doelen</Text>
            </View>
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              
              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                    <Text style={styles.goalType}>
                      {goal.type === 'save' ? '💾 Sparen' : '📉 Besparen'}
                    </Text>
                  </View>
                  <View style={styles.goalProgressBar}>
                    <View 
                      style={[
                        styles.goalProgressFill, 
                        { width: `${Math.min(percentage, 100)}%` }
                      ]} 
                    />
                  </View>
                  <View style={styles.goalAmounts}>
                    <Text style={styles.goalCurrent}>€{goal.currentAmount.toLocaleString()}</Text>
                    <Text style={styles.goalTarget}>/ €{goal.targetAmount.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.goalDeadline}>Deadline: {goal.deadline}</Text>
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
              <Text style={styles.profileSectionTitle}>🏦 Bank Verbinding</Text>
              <PSD2Connect
                onConnect={handlePSD2Connect}
                onSuccess={handlePSD2Success}
                onError={handlePSD2Error}
              />
            </View>

            {accounts.length > 0 && (
              <View style={styles.profileSection}>
                <Text style={styles.profileSectionTitle}>💳 Gekoppelde Rekeningen</Text>
                {accounts.map((account) => (
                  <View key={account.id} style={styles.accountItem}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountBalance}>
                      €{account.balance.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.profileSection}>
              <Text style={styles.profileSectionTitle}>⚙️ Instellingen</Text>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Notificaties</Text>
                <Text style={styles.settingValue}>Aan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Privacy</Text>
                <Text style={styles.settingValue}>Beheren</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Text style={styles.settingText}>Export Data</Text>
                <Text style={styles.settingValue}>Download</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {renderContent()}
        <Navigation activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    maxWidth: 400,
  },
  // Transaction styles
  transactionItem: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Budget styles
  budgetCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  budgetStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 12,
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetSpent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  budgetLimit: {
    fontSize: 16,
    color: '#64748B',
  },
  // Goal styles
  goalCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  goalType: {
    fontSize: 14,
    color: '#64748B',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 12,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalCurrent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  goalTarget: {
    fontSize: 16,
    color: '#64748B',
  },
  goalDeadline: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Profile styles
  profileSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  accountName: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  accountBalance: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingText: {
    fontSize: 16,
    color: '#374151',
  },
  settingValue: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
