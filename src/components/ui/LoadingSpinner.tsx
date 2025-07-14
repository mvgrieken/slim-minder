import React from 'react';
import styled, { keyframes } from 'styled-components';

// Spinner animation
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled spinner container
const SpinnerContainer = styled.div<{ size: string; inline: boolean }>`
  display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  ${({ inline }) => !inline && 'width: 100%; height: 100%;'}
`;

// Styled spinner
const Spinner = styled.div<{ size: string; color: string }>`
  width: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return '16px';
      case 'medium':
        return '24px';
      case 'large':
        return '32px';
      case 'extra-large':
        return '48px';
      default:
        return '24px';
    }
  }};
  height: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return '16px';
      case 'medium':
        return '24px';
      case 'large':
        return '32px';
      case 'extra-large':
        return '48px';
      default:
        return '24px';
    }
  }};
  border: ${({ size }) => {
    switch (size) {
      case 'small':
        return '2px';
      case 'medium':
        return '2px';
      case 'large':
        return '3px';
      case 'extra-large':
        return '4px';
      default:
        return '2px';
    }
  }} solid ${({ color, theme }) => {
    switch (color) {
      case 'primary':
        return theme.colors.primary[500];
      case 'secondary':
        return theme.colors.secondary[500];
      case 'white':
        return theme.colors.white;
      case 'gray':
        return theme.colors.gray[400];
      default:
        return theme.colors.primary[500];
    }
  }};
  border-top: ${({ size }) => {
    switch (size) {
      case 'small':
        return '2px';
      case 'medium':
        return '2px';
      case 'large':
        return '3px';
      case 'extra-large':
        return '4px';
      default:
        return '2px';
    }
  }} solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  /* Respect user's motion preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    
    /* Show a static indicator instead */
    &::after {
      content: '⏳';
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${({ size }) => {
        switch (size) {
          case 'small':
            return '12px';
          case 'medium':
            return '16px';
          case 'large':
            return '20px';
          case 'extra-large':
            return '24px';
          default:
            return '16px';
        }
      }};
    }
  }
`;

// Loading text
const LoadingText = styled.span<{ size: string }>`
  margin-left: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return theme.typography.fontSize.xs;
      case 'medium':
        return theme.typography.fontSize.sm;
      case 'large':
        return theme.typography.fontSize.base;
      case 'extra-large':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.sm;
    }
  }};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// Component props interface
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  inline?: boolean;
  className?: string;
  'aria-label'?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  text,
  inline = false,
  className,
  'aria-label': ariaLabel = 'Laden...',
}) => {
  return (
    <SpinnerContainer 
      size={size} 
      inline={inline} 
      className={className}
      role="status"
      aria-label={ariaLabel}
    >
      <Spinner 
        size={size} 
        color={color}
        aria-hidden="true"
      />
      {text && (
        <LoadingText size={size}>
          {text}
        </LoadingText>
      )}
      {/* Screen reader only text */}
      <span className="sr-only">{ariaLabel}</span>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 