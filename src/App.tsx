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
import { NotificationProvider } from './components/NotificationProvider';

// Pages
import HomePage from './pages/HomePage';
import SafeHomePage from './pages/SafeHomePage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import AICoachPage from './pages/AICoachPage';
import GamificationPage from './pages/GamificationPage';
import InspirationPage from './pages/InspirationPage';
import NotFoundPage from './pages/NotFoundPage';
import BankConnectionPage from './pages/BankConnectionPage';
import NotificationsPage from './pages/NotificationsPage';
import DiagnosticPage from './pages/DiagnosticPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <AppProvider>
            <NotificationProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<SafeHomePage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/budgets" element={<BudgetsPage />} />
                  <Route path="/savings" element={<SavingsGoalsPage />} />
                  <Route path="/coach" element={<AICoachPage />} />
                  <Route path="/gamification" element={<GamificationPage />} />
                  <Route path="/inspiration" element={<InspirationPage />} />
                  <Route path="/bank-connection" element={<BankConnectionPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/diagnostic" element={<DiagnosticPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
            </NotificationProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 