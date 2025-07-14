import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';

// Styles and Theme
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';

// Contexts
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Layout Components
import Layout from '@/components/layout/Layout';
import AuthLayout from '@/components/layout/AuthLayout';

// Pages
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import BudgetsPage from '@/pages/BudgetsPage';
import GoalsPage from '@/pages/GoalsPage';
import AICoachPage from '@/pages/AICoachPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ProfilePage from '@/pages/ProfilePage';
import BankAccountsPage from '@/pages/BankAccountsPage';
import ReportsPage from '@/pages/ReportsPage';
import GamificationPage from '@/pages/GamificationPage';

// Error and Loading Components
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFoundPage from '@/pages/NotFoundPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects authenticated users)
interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Main App Routes Component
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        } 
      />
      
      {/* Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <TransactionsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <Layout>
              <BudgetsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Layout>
              <GoalsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-coach"
        element={
          <ProtectedRoute>
            <Layout>
              <AICoachPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/bank-accounts"
        element={
          <ProtectedRoute>
            <Layout>
              <BankAccountsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/gamification"
        element={
          <ProtectedRoute>
            <Layout>
              <GamificationPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <AuthProvider>
            <div className="App">
              {/* Accessibility: Skip to main content link */}
              <a href="#main-content" className="skip-link">
                Ga naar hoofdinhoud
              </a>
              
              {/* Main App Routes */}
              <AppRoutes />
              
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName="toast-container"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: theme.colors.white,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.gray[200]}`,
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadows.lg,
                    fontSize: theme.typography.fontSize.sm,
                    padding: '12px 16px',
                  },
                  success: {
                    iconTheme: {
                      primary: theme.colors.secondary[500],
                      secondary: theme.colors.white,
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: theme.colors.error[500],
                      secondary: theme.colors.white,
                    },
                  },
                }}
              />
            </div>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 