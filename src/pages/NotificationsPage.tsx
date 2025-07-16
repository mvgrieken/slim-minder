import React, { useState } from 'react';
import styled from 'styled-components';
import { Bell, Settings, Clock, AlertTriangle, CheckCircle, XCircle, Shield, Wifi } from 'react-feather';
import { useNotifications } from '../hooks/useNotifications';

const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'preferences' | 'setup'>('history');
  
  const {
    notifications,
    preferences,
    isEnabled,
    isSupported,
    permission,
    loading,
    requestPermission,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    updatePreference,
    sendTestNotification,
    subscribeToPush,
    unsubscribeFromPush,
    getPushSubscription,
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return <AlertTriangle size={20} color="#f59e0b" />;
      case 'savings_reminder':
        return <Clock size={20} color="#3b82f6" />;
      case 'goal_achieved':
        return <CheckCircle size={20} color="#10b981" />;
      case 'ai_advice':
        return <Bell size={20} color="#8b5cf6" />;
      case 'spending_alert':
        return <AlertTriangle size={20} color="#ef4444" />;
      default:
        return <Bell size={20} color="#6b7280" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return 'Budget Alert';
      case 'savings_reminder':
        return 'Spaarherinnering';
      case 'goal_achieved':
        return 'Doel Bereikt';
      case 'ai_advice':
        return 'AI Advies';
      case 'spending_alert':
        return 'Uitgave Alert';
      case 'system':
        return 'Systeem';
      default:
        return type;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} min geleden`;
    if (hours < 24) return `${hours} uur geleden`;
    if (days < 7) return `${days} dagen geleden`;
    return timestamp.toLocaleDateString('nl-NL');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Laden...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <Bell size={24} />
          Notificaties
        </Title>
        {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          Geschiedenis ({notifications.length})
        </Tab>
        <Tab 
          active={activeTab === 'preferences'} 
          onClick={() => setActiveTab('preferences')}
        >
          <Settings size={16} />
          Instellingen
        </Tab>
        <Tab 
          active={activeTab === 'setup'} 
          onClick={() => setActiveTab('setup')}
        >
          <Shield size={16} />
          Setup
        </Tab>
      </TabContainer>

      {activeTab === 'history' && (
        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyState>
              <Bell size={48} color="#9ca3af" />
              <EmptyText>Geen notificaties</EmptyText>
              <EmptySubtext>Je hebt nog geen notificaties ontvangen</EmptySubtext>
            </EmptyState>
          ) : (
            notifications.map(notification => (
              <NotificationItem key={notification.id} unread={!notification.read}>
                <NotificationIcon>
                  {getNotificationIcon(notification.type)}
                </NotificationIcon>
                <NotificationContent>
                  <NotificationHeader>
                    <NotificationTitle>{notification.title}</NotificationTitle>
                    <NotificationTime>{formatTimestamp(notification.timestamp)}</NotificationTime>
                  </NotificationHeader>
                  <NotificationMessage>{notification.message}</NotificationMessage>
                  <NotificationType>{getNotificationTypeLabel(notification.type)}</NotificationType>
                </NotificationContent>
                <NotificationActions>
                  {!notification.read && (
                    <ActionButton onClick={() => markAsRead(notification.id)}>
                      <CheckCircle size={16} />
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => deleteNotification(notification.id)}>
                    <XCircle size={16} />
                  </ActionButton>
                </NotificationActions>
              </NotificationItem>
            ))
          )}
        </NotificationList>
      )}

      {activeTab === 'preferences' && (
        <PreferencesContainer>
          <SectionTitle>Notificatie Instellingen</SectionTitle>
          <PreferencesList>
            {preferences.map(preference => (
              <PreferenceItem key={preference.type}>
                <PreferenceInfo>
                  <PreferenceTitle>{getNotificationTypeLabel(preference.type)}</PreferenceTitle>
                  <PreferenceDescription>
                    {preference.type === 'budget_alert' && 'Ontvang alerts wanneer je budget wordt overschreden'}
                    {preference.type === 'savings_reminder' && 'Herinneringen voor spaardoelen'}
                    {preference.type === 'spending_alert' && 'Alerts voor ongewone uitgaven'}
                    {preference.type === 'goal_achieved' && 'Vieringen wanneer doelen worden bereikt'}
                    {preference.type === 'ai_advice' && 'Persoonlijke financiële adviezen'}
                    {preference.type === 'system' && 'Systeem updates en onderhoud'}
                  </PreferenceDescription>
                </PreferenceInfo>
                <PreferenceControls>
                  <ToggleSwitch
                    checked={preference.enabled}
                    onChange={(e) => updatePreference(preference.type, 'enabled', e.target.checked)}
                  />
                  {preference.enabled && (
                    <FrequencySelect
                      value={preference.frequency}
                      onChange={(e) => updatePreference(preference.type, 'frequency', e.target.value)}
                    >
                      <option value="immediate">Direct</option>
                      <option value="daily">Dagelijks</option>
                      <option value="weekly">Wekelijks</option>
                    </FrequencySelect>
                  )}
                </PreferenceControls>
              </PreferenceItem>
            ))}
          </PreferencesList>

          <SectionTitle>Test Notificaties</SectionTitle>
          <TestButtons>
            <TestButton onClick={sendTestNotification}>
              Test Notificatie Sturen
            </TestButton>
            <TestButton onClick={markAllAsRead}>
              Alles Als Gelezen Markeren
            </TestButton>
          </TestButtons>
        </PreferencesContainer>
      )}

      {activeTab === 'setup' && (
        <SetupContainer>
          <SectionTitle>Notificatie Setup</SectionTitle>
          
          <SetupCard>
            <SetupCardHeader>
              <Shield size={24} color="#3b82f6" />
              <SetupCardTitle>Browser Notificaties</SetupCardTitle>
            </SetupCardHeader>
            <SetupCardContent>
              <StatusRow>
                <StatusLabel>Ondersteuning:</StatusLabel>
                <StatusValue supported={isSupported}>
                  {isSupported ? 'Ondersteund' : 'Niet ondersteund'}
                </StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>Toestemming:</StatusLabel>
                <StatusValue supported={permission === 'granted'}>
                  {permission === 'granted' ? 'Toegestaan' : 
                   permission === 'denied' ? 'Geweigerd' : 'Niet gevraagd'}
                </StatusValue>
              </StatusRow>
              <StatusRow>
                <StatusLabel>Status:</StatusLabel>
                <StatusValue supported={isEnabled}>
                  {isEnabled ? 'Actief' : 'Inactief'}
                </StatusValue>
              </StatusRow>
              
              {!isEnabled && permission !== 'denied' && (
                <EnableButton onClick={requestPermission}>
                  Notificaties Inschakelen
                </EnableButton>
              )}
              
              {permission === 'denied' && (
                <WarningMessage>
                  Notificaties zijn geblokkeerd. Ga naar je browser instellingen om dit te wijzigen.
                </WarningMessage>
              )}
            </SetupCardContent>
          </SetupCard>

          <SetupCard>
            <SetupCardHeader>
              <Wifi size={24} color="#10b981" />
              <SetupCardTitle>Push Notificaties</SetupCardTitle>
            </SetupCardHeader>
            <SetupCardContent>
              <PushDescription>
                Ontvang notificaties zelfs wanneer de app gesloten is.
              </PushDescription>
              
              <PushButtons>
                <PushButton onClick={subscribeToPush}>
                  Abonneren op Push Notificaties
                </PushButton>
                <PushButton onClick={unsubscribeFromPush} secondary>
                  Afmelden van Push Notificaties
                </PushButton>
              </PushButtons>
            </SetupCardContent>
          </SetupCard>

          <SetupCard>
            <SetupCardHeader>
              <Bell size={24} color="#8b5cf6" />
              <SetupCardTitle>Notificatie Types</SetupCardTitle>
            </SetupCardHeader>
            <SetupCardContent>
              <NotificationTypesList>
                <NotificationTypeItem>
                  <NotificationTypeIcon>
                    <AlertTriangle size={16} color="#f59e0b" />
                  </NotificationTypeIcon>
                  <NotificationTypeInfo>
                    <NotificationTypeName>Budget Alerts</NotificationTypeName>
                    <NotificationTypeDesc>Wanneer je budget wordt overschreden</NotificationTypeDesc>
                  </NotificationTypeInfo>
                </NotificationTypeItem>
                
                <NotificationTypeItem>
                  <NotificationTypeIcon>
                    <Clock size={16} color="#3b82f6" />
                  </NotificationTypeIcon>
                  <NotificationTypeInfo>
                    <NotificationTypeName>Spaarherinneringen</NotificationTypeName>
                    <NotificationTypeDesc>Herinneringen voor je spaardoelen</NotificationTypeDesc>
                  </NotificationTypeInfo>
                </NotificationTypeItem>
                
                <NotificationTypeItem>
                  <NotificationTypeIcon>
                    <CheckCircle size={16} color="#10b981" />
                  </NotificationTypeIcon>
                  <NotificationTypeInfo>
                    <NotificationTypeName>Doel Bereikt</NotificationTypeName>
                    <NotificationTypeDesc>Vieringen wanneer doelen worden bereikt</NotificationTypeDesc>
                  </NotificationTypeInfo>
                </NotificationTypeItem>
                
                <NotificationTypeItem>
                  <NotificationTypeIcon>
                    <Bell size={16} color="#8b5cf6" />
                  </NotificationTypeIcon>
                  <NotificationTypeInfo>
                    <NotificationTypeName>AI Advies</NotificationTypeName>
                    <NotificationTypeDesc>Persoonlijke financiële tips</NotificationTypeDesc>
                  </NotificationTypeInfo>
                </NotificationTypeItem>
              </NotificationTypesList>
            </SetupCardContent>
          </SetupCard>
        </SetupContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const UnreadBadge = styled.span`
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: none;
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  font-weight: ${props => props.active ? '600' : '500'};
  border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3b82f6;
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotificationItem = styled.div<{ unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: ${props => props.unread ? '#fef3c7' : 'white'};
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const NotificationIcon = styled.div`
  flex-shrink: 0;
  margin-top: 2px;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const NotificationTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const NotificationTime = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const NotificationMessage = styled.p`
  font-size: 14px;
  color: #374151;
  margin: 0 0 8px 0;
  line-height: 1.5;
`;

const NotificationType = styled.span`
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 16px 0 8px 0;
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const PreferencesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
`;

const PreferencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
`;

const PreferenceInfo = styled.div`
  flex: 1;
`;

const PreferenceTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
`;

const PreferenceDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const PreferenceControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 48px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;

  &:checked {
    background: #3b82f6;
  }

  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: all 0.2s;
  }

  &:checked::before {
    transform: translateX(24px);
  }
`;

const FrequencySelect = styled.select`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const TestButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const TestButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const SetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SetupCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const SetupCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const SetupCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const SetupCardContent = styled.div`
  padding: 20px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StatusLabel = styled.span`
  font-size: 14px;
  color: #374151;
`;

const StatusValue = styled.span<{ supported: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.supported ? '#10b981' : '#ef4444'};
`;

const EnableButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover {
    background: #2563eb;
  }
`;

const WarningMessage = styled.div`
  padding: 12px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  color: #92400e;
  font-size: 14px;
  margin-top: 16px;
`;

const PushDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
`;

const PushButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const PushButton = styled.button<{ secondary?: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props => props.secondary ? 'white' : '#10b981'};
  color: ${props => props.secondary ? '#374151' : 'white'};
  border: 1px solid ${props => props.secondary ? '#d1d5db' : '#10b981'};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.secondary ? '#f9fafb' : '#059669'};
  }
`;

const NotificationTypesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NotificationTypeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NotificationTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 8px;
  flex-shrink: 0;
`;

const NotificationTypeInfo = styled.div`
  flex: 1;
`;

const NotificationTypeName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 2px 0;
`;

const NotificationTypeDesc = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 16px;
  color: #6b7280;
`;

export default NotificationsPage; 