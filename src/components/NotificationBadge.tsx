import React from 'react';
import styled from 'styled-components';
import { Bell } from 'react-feather';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationBadgeProps {
  onClick?: () => void;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  onClick, 
  showCount = true, 
  size = 'md' 
}) => {
  const { notifications, isEnabled } = useNotifications();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  return (
    <BadgeContainer onClick={onClick} size={size} hasUnread={hasUnread}>
      <Bell size={getIconSize(size)} />
      {showCount && hasUnread && (
        <BadgeCount size={size}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </BadgeCount>
      )}
      {!showCount && hasUnread && (
        <BadgeDot size={size} />
      )}
    </BadgeContainer>
  );
};

const getIconSize = (size: string) => {
  switch (size) {
    case 'sm': return 16;
    case 'lg': return 24;
    default: return 20;
  }
};

const BadgeContainer = styled.div<{ size: string; hasUnread: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.hasUnread ? '#3b82f6' : '#6b7280'};
  
  &:hover {
    color: #3b82f6;
    transform: scale(1.05);
  }
  
  ${props => props.size === 'sm' && `
    padding: 4px;
  `}
  
  ${props => props.size === 'md' && `
    padding: 6px;
  `}
  
  ${props => props.size === 'lg' && `
    padding: 8px;
  `}
`;

const BadgeCount = styled.span<{ size: string }>`
  position: absolute;
  top: ${props => props.size === 'sm' ? '-2px' : props.size === 'lg' ? '-4px' : '-3px'};
  right: ${props => props.size === 'sm' ? '-2px' : props.size === 'lg' ? '-4px' : '-3px'};
  background: #ef4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size === 'sm' ? '10px' : props.size === 'lg' ? '14px' : '12px'};
  font-weight: 600;
  min-width: ${props => props.size === 'sm' ? '16px' : props.size === 'lg' ? '24px' : '20px'};
  height: ${props => props.size === 'sm' ? '16px' : props.size === 'lg' ? '24px' : '20px'};
  padding: 0 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${props => props.size === 'sm' ? 'pulse-sm' : props.size === 'lg' ? 'pulse-lg' : 'pulse-md'} 2s infinite;
  
  @keyframes pulse-sm {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes pulse-md {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes pulse-lg {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const BadgeDot = styled.div<{ size: string }>`
  position: absolute;
  top: ${props => props.size === 'sm' ? '2px' : props.size === 'lg' ? '4px' : '3px'};
  right: ${props => props.size === 'sm' ? '2px' : props.size === 'lg' ? '4px' : '3px'};
  background: #ef4444;
  border-radius: 50%;
  width: ${props => props.size === 'sm' ? '6px' : props.size === 'lg' ? '10px' : '8px'};
  height: ${props => props.size === 'sm' ? '6px' : props.size === 'lg' ? '10px' : '8px'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

export default NotificationBadge; 