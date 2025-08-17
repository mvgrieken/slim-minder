import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes } from 'styled-components';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: 'FREE' | 'CORE' | 'PREMIUM';
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => props.theme.colors.gray[50]};
`;

const LoadingSpinner = styled(Loader)`
  animation: ${spin} 1s linear infinite;
  color: ${props => props.theme.colors.primary[600]};
  margin-bottom: 16px;
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredTier = 'FREE' 
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size={32} />
        <LoadingText>Account controleren...</LoadingText>
      </LoadingContainer>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check account tier if required
  const tierLevels = { FREE: 0, CORE: 1, PREMIUM: 2 };
  const userTierLevel = tierLevels[user.accountTier];
  const requiredTierLevel = tierLevels[requiredTier];

  if (userTierLevel < requiredTierLevel) {
    return <Navigate to="/upgrade" state={{ requiredTier }} replace />;
  }

  // User is authenticated and has required tier
  return <>{children}</>;
};