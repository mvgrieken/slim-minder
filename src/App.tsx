import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Styles and Theme
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Components
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 