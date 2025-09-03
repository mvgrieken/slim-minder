import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Budget } from '../../services/api';

interface BudgetsContainerProps {
  budgets: Budget[];
}

export const BudgetsContainer: React.FC<BudgetsContainerProps> = ({ budgets }) => {
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
});
