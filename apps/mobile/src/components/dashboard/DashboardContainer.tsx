import React, { useMemo } from 'react';
import { Dashboard } from '../Dashboard';
import { Transaction, Budget } from '../../services/api';

interface DashboardContainerProps {
  transactions: Transaction[];
  budgets: Budget[];
  accounts: any[];
  onRefresh: () => void;
  refreshing: boolean;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  transactions,
  budgets,
  accounts,
  onRefresh,
  refreshing
}) => {
  // Memoized calculations
  const totalBalance = useMemo(() => 
    accounts.reduce((sum, acc) => sum + acc.balance, 0), 
    [accounts]
  );

  const monthlyIncome = useMemo(() => 
    transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0), 
    [transactions]
  );

  const monthlyExpenses = useMemo(() => 
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0), 
    [transactions]
  );

  return (
    <Dashboard
      transactions={transactions}
      budgets={budgets}
      totalBalance={totalBalance}
      monthlyIncome={monthlyIncome}
      monthlyExpenses={monthlyExpenses}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};
