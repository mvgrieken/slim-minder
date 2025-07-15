import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Styles and Theme
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import AICoachPage from './pages/AICoachPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import DatabaseTest from './components/DatabaseTest';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                              <Route path="/test" element={<TestPage />} />
              <Route path="/db-test" element={<DatabaseTest />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/savings" element={<SavingsGoalsPage />} />
              <Route path="/coach" element={<AICoachPage />} />
              <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 