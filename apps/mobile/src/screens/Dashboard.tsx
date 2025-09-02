import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../session';
import { budgetsProgress, BudgetProgress, listTransactions, Transaction } from '../api';
import { formatCurrency } from '@slim-minder/utils';
import { SMButton } from '@slim-minder/ui';
import { format, startOfMonth, endOfMonth, isToday } from 'date-fns';
import { nl } from 'date-fns/locale';

interface DashboardScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalSpent: number;
  totalBudget: number;
  remainingBudget: number;
  budgetUtilization: number;
  transactionsThisMonth: number;
  averageDailySpending: number;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { userId, loading, error } = useSession();
  const [budgetItems, setBudgetItems] = useState<BudgetProgress[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalSpent: 0,
    totalBudget: 0,
    remainingBudget: 0,
    budgetUtilization: 0,
    transactionsThisMonth: 0,
    averageDailySpending: 0,
  });

  const periodStart = useMemo(() => 
    format(startOfMonth(new Date()), 'yyyy-MM-dd'), []
  );
  const periodEnd = useMemo(() => 
    format(endOfMonth(new Date()), 'yyyy-MM-dd'), []
  );

  async function doRefresh() {
    if (!userId) return;
    setRefreshing(true);
    try {
      const [budgets, txs] = await Promise.all([
        budgetsProgress(userId, periodStart),
        listTransactions(userId, { from: periodStart, to: periodEnd })
      ]);
      
      setBudgetItems(budgets);
      setTransactions(txs);
      
      // Calculate stats
      const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
      const totalBudget = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
      const remainingBudget = Math.max(0, totalBudget - totalSpent);
      const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const daysPassed = new Date().getDate();
      const averageDailySpending = daysPassed > 0 ? totalSpent / daysPassed : 0;
      
      setStats({
        totalSpent,
        totalBudget,
        remainingBudget,
        budgetUtilization,
        transactionsThisMonth: txs.length,
        averageDailySpending,
      });
    } catch (err) {
      console.error('Failed to refresh dashboard:', err);
      Alert.alert('Fout', 'Kon gegevens niet laden. Probeer het opnieuw.');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (userId) doRefresh();
  }, [userId, periodStart]);

  const getBudgetStatusColor = (ratio: number) => {
    if (ratio >= 1) return '#DC2626'; // Red
    if (ratio >= 0.8) return '#EA580C'; // Orange
    if (ratio >= 0.6) return '#F59E0B'; // Yellow
    return '#16A34A'; // Green
  };

  const getBudgetStatusText = (ratio: number) => {
    if (ratio >= 1) return 'Overschreden';
    if (ratio >= 0.8) return 'Bijna op';
    if (ratio >= 0.6) return 'Let op';
    return 'OK';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Sessie laden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <SMButton
            title="Opnieuw proberen"
            onPress={() => window.location.reload()}
            variant="primary"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={doRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>
            {format(new Date(), 'MMMM yyyy', { locale: nl })}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Uitgegeven</Text>
            <Text style={styles.statValue}>
              {formatCurrency(stats.totalSpent)}
            </Text>
            <Text style={styles.statSubtext}>
              van {formatCurrency(stats.totalBudget)} budget
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Over</Text>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>
              {formatCurrency(stats.remainingBudget)}
            </Text>
            <Text style={styles.statSubtext}>
              {stats.budgetUtilization.toFixed(1)}% gebruikt
            </Text>
          </View>
        </View>

        {/* Budget Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budgetten</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Bekijk alle</Text>
            </TouchableOpacity>
          </View>
          
          {budgetItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nog geen budgetten</Text>
              <Text style={styles.emptyText}>
                Voeg je eerste budget toe om je uitgaven bij te houden
              </Text>
              <SMButton
                title="Budget toevoegen"
                onPress={() => {/* Navigate to budget creation */}}
                variant="primary"
                size="small"
                style={{ marginTop: 12 }}
              />
            </View>
          ) : (
            budgetItems.map((budget) => {
              const spent = budget.spent || 0;
              const ratio = Math.min(1, (budget.limit ? spent / budget.limit : 0));
              const color = getBudgetStatusColor(ratio);
              const status = getBudgetStatusText(ratio);
              
              return (
                <View key={budget.budgetId} style={styles.budgetCard}>
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetName}>
                      {budget.categoryName || 'Onbekende categorie'}
                    </Text>
                    <Text style={styles.budgetAmount}>
                      {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                    </Text>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${ratio * 100}%`, backgroundColor: color }
                        ]}
                      />
                    </View>
                    <Text style={[styles.budgetStatus, { color }]}>
                      {status}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recente transacties</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Bekijk alle</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Geen transacties</Text>
              <Text style={styles.emptyText}>
                Je hebt nog geen transacties deze maand
              </Text>
            </View>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {tx.description || 'Onbekende transactie'}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {format(new Date(tx.date), 'dd MMM', { locale: nl })}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: tx.amount < 0 ? '#16A34A' : '#DC2626' }
                ]}>
                  {formatCurrency(Math.abs(tx.amount))}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Snelle acties</Text>
          <View style={styles.quickActions}>
            <SMButton
              title="AI Coach"
              onPress={() => navigation.navigate('AIChat')}
              variant="outline"
              size="small"
              style={{ flex: 1, marginRight: 8 }}
            />
            <SMButton
              title="Bank Verbinden"
              onPress={() => navigation.navigate('BankAccounts')}
              variant="outline"
              size="small"
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  sectionAction: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
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
    marginBottom: 8,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#64748B',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetStatus: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 60,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
