import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'month' | 'week';
}

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  budgets,
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');

  const recentTransactions = transactions.slice(0, 5);
  const budgetProgress = budgets.map(budget => ({
    ...budget,
    percentage: (budget.spent / budget.limit) * 100,
    status: budget.spent >= budget.limit ? 'over' : 
            budget.spent >= budget.limit * 0.9 ? 'warning' : 'good'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'good': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'over': return 'Overschreden';
      case 'warning': return 'Bijna op';
      case 'good': return 'Op schema';
      default: return 'Onbekend';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Balance Overview */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Totaal Saldo</Text>
        <Text style={styles.balanceAmount}>€{totalBalance.toLocaleString()}</Text>
        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeExpenseItem}>
            <Text style={styles.incomeExpenseLabel}>Inkomsten</Text>
            <Text style={styles.incomeAmount}>€{monthlyIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.incomeExpenseItem}>
            <Text style={styles.incomeExpenseLabel}>Uitgaven</Text>
            <Text style={styles.expenseAmount}>€{monthlyExpenses.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'week' && styles.periodButtonTextActive]}>
            Deze Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodButtonText, selectedPeriod === 'month' && styles.periodButtonTextActive]}>
            Deze Maand
          </Text>
        </TouchableOpacity>
      </View>

      {/* Budgets Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Budgetten</Text>
        {budgetProgress.length > 0 ? (
          budgetProgress.map((budget) => (
            <View key={budget.id} style={styles.budgetItem}>
              <View style={styles.budgetHeader}>
                <Text style={styles.budgetCategory}>{budget.category}</Text>
                <Text style={[styles.budgetStatus, { color: getStatusColor(budget.status) }]}>
                  {getStatusText(budget.status)}
                </Text>
              </View>
              <View style={styles.budgetProgressBar}>
                <View 
                  style={[
                    styles.budgetProgressFill, 
                    { 
                      width: `${Math.min(budget.percentage, 100)}%`,
                      backgroundColor: getStatusColor(budget.status)
                    }
                  ]} 
                />
              </View>
              <View style={styles.budgetAmounts}>
                <Text style={styles.budgetSpent}>€{budget.spent.toLocaleString()}</Text>
                <Text style={styles.budgetLimit}>/ €{budget.limit.toLocaleString()}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nog geen budgetten ingesteld</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Budget Toevoegen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💳 Recente Transacties</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Bekijk alle</Text>
          </TouchableOpacity>
        </View>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
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
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nog geen transacties</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Transactie Toevoegen</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Snelle Acties</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>Transactie</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>🎯</Text>
            <Text style={styles.quickActionText}>Doel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📈</Text>
            <Text style={styles.quickActionText}>Rapport</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  balanceCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  incomeExpenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incomeExpenseItem: {
    alignItems: 'center',
  },
  incomeExpenseLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  budgetItem: {
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  budgetStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  budgetLimit: {
    fontSize: 14,
    color: '#64748B',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});

