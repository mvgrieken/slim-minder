import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ApiService, Transaction, Budget, SavingsGoal } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const TestContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TestSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
`;

const TestTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
`;

const TestButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TestResult = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #28a745;
  
  &.error {
    border-left-color: #dc3545;
    background: #f8d7da;
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  
  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }
  
  th {
    background: #f8f9fa;
    font-weight: bold;
  }
`;

const DatabaseTest: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testConnection = () => runTest('connection', async () => {
    const user = await ApiService.getCurrentUser();
    return { message: 'Supabase connection successful', user };
  });

  const testTransactions = () => runTest('transactions', async () => {
    if (!user) throw new Error('No user found');
    const transactions = await ApiService.getTransactions(user.id);
    return transactions;
  });

  const testBudgets = () => runTest('budgets', async () => {
    if (!user) throw new Error('No user found');
    const budgets = await ApiService.getBudgets(user.id);
    return budgets;
  });

  const testSavingsGoals = () => runTest('savingsGoals', async () => {
    if (!user) throw new Error('No user found');
    const goals = await ApiService.getSavingsGoals(user.id);
    return goals;
  });

  const testDashboardStats = () => runTest('dashboardStats', async () => {
    if (!user) throw new Error('No user found');
    const stats = await ApiService.getDashboardStats(user.id);
    return stats;
  });

  const testCreateTransaction = () => runTest('createTransaction', async () => {
    if (!user) throw new Error('No user found');
    const newTransaction = await ApiService.createTransaction({
      user_id: user.id,
      amount: -50,
      description: 'Test transactie',
      category: 'Test',
      transaction_date: new Date().toISOString().split('T')[0]
    });
    return newTransaction;
  });

  const renderTestResult = (testName: string) => {
    const result = testResults[testName];
    if (!result) return null;

    return (
      <TestResult className={result.success ? '' : 'error'}>
        <strong>{result.success ? '✅ Success:' : '❌ Error:'}</strong>
        {result.success ? (
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        ) : (
          <div>{result.error}</div>
        )}
      </TestResult>
    );
  };

  const renderDataTable = (data: any[], title: string) => {
    if (!data || data.length === 0) return <div>Geen data gevonden</div>;

    const columns = Object.keys(data[0]);
    
    return (
      <DataTable>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map(col => (
                <td key={col}>{String(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </DataTable>
    );
  };

  return (
    <TestContainer>
      <h2>Database Test Panel</h2>
      <p>Test de Supabase connectie en API functies</p>

      <TestSection>
        <TestTitle>1. Supabase Connectie Test</TestTitle>
        <TestButton 
          onClick={testConnection}
          disabled={loading.connection}
        >
          {loading.connection ? 'Testing...' : 'Test Connectie'}
        </TestButton>
        {renderTestResult('connection')}
      </TestSection>

      <TestSection>
        <TestTitle>2. Transacties Test</TestTitle>
        <TestButton 
          onClick={testTransactions}
          disabled={loading.transactions}
        >
          {loading.transactions ? 'Loading...' : 'Laad Transacties'}
        </TestButton>
        <TestButton 
          onClick={testCreateTransaction}
          disabled={loading.createTransaction}
        >
          {loading.createTransaction ? 'Creating...' : 'Maak Test Transactie'}
        </TestButton>
        {renderTestResult('transactions')}
        {testResults.transactions?.success && renderDataTable(testResults.transactions.data, 'Transacties')}
      </TestSection>

      <TestSection>
        <TestTitle>3. Budgetten Test</TestTitle>
        <TestButton 
          onClick={testBudgets}
          disabled={loading.budgets}
        >
          {loading.budgets ? 'Loading...' : 'Laad Budgetten'}
        </TestButton>
        {renderTestResult('budgets')}
        {testResults.budgets?.success && renderDataTable(testResults.budgets.data, 'Budgetten')}
      </TestSection>

      <TestSection>
        <TestTitle>4. Spaardoelen Test</TestTitle>
        <TestButton 
          onClick={testSavingsGoals}
          disabled={loading.savingsGoals}
        >
          {loading.savingsGoals ? 'Loading...' : 'Laad Spaardoelen'}
        </TestButton>
        {renderTestResult('savingsGoals')}
        {testResults.savingsGoals?.success && renderDataTable(testResults.savingsGoals.data, 'Spaardoelen')}
      </TestSection>

      <TestSection>
        <TestTitle>5. Dashboard Statistieken Test</TestTitle>
        <TestButton 
          onClick={testDashboardStats}
          disabled={loading.dashboardStats}
        >
          {loading.dashboardStats ? 'Calculating...' : 'Bereken Dashboard Stats'}
        </TestButton>
        {renderTestResult('dashboardStats')}
        {testResults.dashboardStats?.success && (
          <div>
            <h4>Dashboard Overzicht:</h4>
            <pre>{JSON.stringify(testResults.dashboardStats.data, null, 2)}</pre>
          </div>
        )}
      </TestSection>

      <TestSection>
        <TestTitle>6. Huidige Gebruiker</TestTitle>
        <div>
          <strong>User ID:</strong> {user?.id || 'Geen gebruiker'}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || 'Geen email'}
        </div>
      </TestSection>
    </TestContainer>
  );
};

export default DatabaseTest; 