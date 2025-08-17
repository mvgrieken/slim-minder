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
import { ProtectedRoute } from './components/ProtectedRoute';

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
                  <Route path="/" element={<HomePage />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <TransactionsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/budgets" element={
                    <ProtectedRoute>
                      <BudgetsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/savings" element={
                    <ProtectedRoute>
                      <SavingsGoalsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/coach" element={
                    <ProtectedRoute requiredTier="CORE">
                      <AICoachPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/gamification" element={
                    <ProtectedRoute>
                      <GamificationPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/inspiration" element={<InspirationPage />} />
                  <Route path="/bank-connection" element={
                    <ProtectedRoute requiredTier="CORE">
                      <BankConnectionPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />
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