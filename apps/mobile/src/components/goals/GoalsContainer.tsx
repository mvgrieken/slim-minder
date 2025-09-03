import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Goal } from '../../services/api';

interface GoalsContainerProps {
  goals: Goal[];
}

export const GoalsContainer: React.FC<GoalsContainerProps> = ({ goals }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Doelen</Text>
        <Text style={styles.subtitle}>Stel je financiële doelen en behaal ze</Text>
      </View>
      {goals.map((goal) => {
        const percentage = (goal.currentAmount / goal.targetAmount) * 100;
        
        return (
          <View key={goal.id} style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalTarget}>€{goal.targetAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={[
                styles.progressBar,
                { width: `${Math.min(percentage, 100)}%` },
                { backgroundColor: '#10B981' }
              ]} />
            </View>
            <Text style={styles.goalPercentage}>{percentage.toFixed(1)}%</Text>
            <Text style={styles.goalCurrent}>€{goal.currentAmount.toLocaleString()} gespaard</Text>
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
  progressBar: {
    height: '100%',
    borderRadius: 4,
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
});
