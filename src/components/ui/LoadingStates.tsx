import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Loader, RefreshCw, AlertCircle, Plus } from 'lucide-react';

// Loading animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Full page loading
const FullPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: 40px 20px;
`;

const LoadingSpinner = styled(Loader)`
  animation: ${spin} 1s linear infinite;
  color: ${props => props.theme.colors.primary[600]};
  margin-bottom: 16px;
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: center;
`;

export const FullPageLoading: React.FC<{ message?: string }> = ({ 
  message = "Gegevens laden..." 
}) => (
  <FullPageContainer>
    <LoadingSpinner size={32} />
    <LoadingText>{message}</LoadingText>
  </FullPageContainer>
);

// Card loading skeleton
const SkeletonCard = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.gray[200]};
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.5s ease-in-out infinite;
  border-radius: 4px;
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const TransactionSkeleton: React.FC = () => (
  <SkeletonCard>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div style={{ flex: 1 }}>
        <SkeletonLine width="60%" height="20px" />
        <SkeletonLine width="40%" height="14px" />
      </div>
      <SkeletonLine width="80px" height="20px" />
    </div>
  </SkeletonCard>
);

export const BudgetSkeleton: React.FC = () => (
  <SkeletonCard>
    <SkeletonLine width="50%" height="18px" />
    <SkeletonLine width="100%" height="8px" />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
      <SkeletonLine width="30%" height="16px" />
      <SkeletonLine width="25%" height="16px" />
    </div>
  </SkeletonCard>
);

export const StatCardSkeleton: React.FC = () => (
  <SkeletonCard>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <SkeletonLine width="40px" height="40px" />
      <div style={{ marginLeft: '12px', flex: 1 }}>
        <SkeletonLine width="60%" height="14px" />
      </div>
    </div>
    <SkeletonLine width="80%" height="24px" />
  </SkeletonCard>
);

// Inline loading states
const InlineSpinner = styled(RefreshCw)<{ size?: number }>`
  animation: ${spin} 1s linear infinite;
  color: ${props => props.theme.colors.primary[600]};
  width: ${props => props.size || 16}px;
  height: ${props => props.size || 16}px;
`;

export const InlineLoading: React.FC<{ size?: number; message?: string }> = ({ 
  size = 16, 
  message 
}) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
    <InlineSpinner size={size} />
    {message && <span style={{ fontSize: '14px', color: '#6b7280' }}>{message}</span>}
  </span>
);

// Error states
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
`;

const ErrorIcon = styled(AlertCircle)`
  color: ${props => props.theme.colors.error[500]};
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: 8px;
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${props => props.theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }
`;

export const ErrorState: React.FC<{ 
  title?: string; 
  message?: string; 
  onRetry?: () => void;
}> = ({ 
  title = "Er ging iets mis",
  message = "We konden de gegevens niet laden. Probeer het opnieuw.",
  onRetry
}) => (
  <ErrorContainer>
    <ErrorIcon size={48} />
    <ErrorTitle>{title}</ErrorTitle>
    <ErrorMessage>{message}</ErrorMessage>
    {onRetry && (
      <RetryButton onClick={onRetry}>
        <RefreshCw size={16} />
        Opnieuw proberen
      </RetryButton>
    )}
  </ErrorContainer>
);

// Empty states
const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-bottom: 8px;
`;

const EmptyMessage = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: 24px;
`;

const EmptyAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${props => props.theme.colors.primary[600]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary[700]};
  }
`;

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  icon,
  title = "Geen gegevens",
  message = "Er zijn nog geen items om weer te geven.",
  actionText,
  onAction
}) => (
  <EmptyContainer>
    {icon && <div style={{ marginBottom: '16px', color: '#9ca3af' }}>{icon}</div>}
    <EmptyTitle>{title}</EmptyTitle>
    <EmptyMessage>{message}</EmptyMessage>
    {actionText && onAction && (
      <EmptyAction onClick={onAction}>
        <Plus size={16} />
        {actionText}
      </EmptyAction>
    )}
  </EmptyContainer>
);