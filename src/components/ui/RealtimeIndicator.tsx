import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Wifi, WifiOff } from 'lucide-react';

interface RealtimeIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date | null;
  className?: string;
}

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const Container = styled.div<{ isConnected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${props => props.isConnected 
    ? props.theme.colors.success + '15' 
    : props.theme.colors.error + '15'
  };
  color: ${props => props.isConnected 
    ? props.theme.colors.success 
    : props.theme.colors.error
  };
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  svg {
    width: 14px;
    height: 14px;
    animation: ${props => props.isConnected ? pulse : 'none'} 2s infinite;
  }
`;

const StatusText = styled.span`
  white-space: nowrap;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LastUpdate = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 11px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const RealtimeIndicator: React.FC<RealtimeIndicatorProps> = ({
  isConnected,
  lastUpdate,
  className
}) => {
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return 'zojuist';
    if (minutes < 60) return `${minutes}m geleden`;
    if (hours < 24) return `${hours}u geleden`;
    return date.toLocaleDateString('nl-NL');
  };

  return (
    <Container isConnected={isConnected} className={className}>
      {isConnected ? <Wifi /> : <WifiOff />}
      <StatusText>
        {isConnected ? 'Live data' : 'Offline'}
      </StatusText>
      {lastUpdate && (
        <LastUpdate>
          • {formatLastUpdate(lastUpdate)}
        </LastUpdate>
      )}
    </Container>
  );
};