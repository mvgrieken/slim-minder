import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

// Styled components
const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ErrorCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const ErrorIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  svg {
    width: 64px;
    height: 64px;
    color: ${({ theme }) => theme.colors.error[500]};
  }
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ErrorDetails = styled.details`
  margin-top: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  
  summary {
    cursor: pointer;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }
`;

const ErrorStack = styled.pre`
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  overflow: auto;
  max-height: 200px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.components.button.padding.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeOut};
  
  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
        background-color: ${theme.colors.primary[600]};
        color: ${theme.colors.white};
        
        &:hover {
          background-color: ${theme.colors.primary[700]};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
        }
      `
      : `
        background-color: ${theme.colors.white};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.gray[300]};
        
        &:hover {
          background-color: ${theme.colors.gray[50]};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${theme.colors.gray[100]};
        }
      `}
      
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Error boundary props and state interfaces
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRefresh = () => {
    // Reset error state and reload the page
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    // Reset error state and navigate to home
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorIcon>
              <AlertTriangle />
            </ErrorIcon>
            
            <ErrorTitle>
              Er ging iets mis
            </ErrorTitle>
            
            <ErrorMessage>
              We hebben een onverwachte fout gedetecteerd. Dit is automatisch gerapporteerd 
              en ons team gaat er mee aan de slag. Probeer de pagina te vernieuwen of ga 
              terug naar de homepagina.
            </ErrorMessage>

            <ActionButtons>
              <Button variant="primary" onClick={this.handleRefresh}>
                <RefreshCw />
                Pagina vernieuwen
              </Button>
              
              <Button variant="secondary" onClick={this.handleGoHome}>
                <Home />
                Ga naar home
              </Button>
            </ActionButtons>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <ErrorDetails>
                <summary>Fout details (alleen zichtbaar in development)</summary>
                <ErrorStack>
                  <strong>Error:</strong> {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      <br /><br />
                      <strong>Stack trace:</strong>
                      <br />
                      {this.state.error.stack}
                    </>
                  )}
                  {this.state.errorInfo && (
                    <>
                      <br /><br />
                      <strong>Component stack:</strong>
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </ErrorStack>
              </ErrorDetails>
            )}
          </ErrorCard>
        </ErrorContainer>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 