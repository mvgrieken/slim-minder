import { useState, useEffect, useCallback } from 'react';
import notificationService, { 
  Notification, 
  NotificationPreference, 
  PushNotificationPayload 
} from '../services/notificationService';

interface UseNotificationsReturn {
  // State
  notifications: Notification[];
  preferences: NotificationPreference[];
  isEnabled: boolean;
  isSupported: boolean;
  permission: NotificationPermission;
  loading: boolean;
  
  // Actions
  initialize: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (payload: PushNotificationPayload) => Promise<boolean>;
  sendBudgetAlert: (category: string, percentage: number, amount: number) => Promise<boolean>;
  sendSavingsReminder: (goalName: string, amount: number) => Promise<boolean>;
  sendGoalAchieved: (goalName: string, amount: number) => Promise<boolean>;
  sendSpendingAlert: (amount: number, merchant: string) => Promise<boolean>;
  sendAIAdvice: (advice: string) => Promise<boolean>;
  sendSystemNotification: (title: string, message: string) => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
  
  // Notification management
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  
  // Preference management
  loadPreferences: () => Promise<void>;
  updatePreference: (type: string, field: keyof NotificationPreference, value: any) => Promise<void>;
  
  // Push subscription
  subscribeToPush: () => Promise<PushSubscription | null>;
  unsubscribeFromPush: () => Promise<boolean>;
  getPushSubscription: () => Promise<PushSubscription | null>;
  
  // Scheduling
  scheduleNotification: (payload: PushNotificationPayload, delay: number) => Promise<string>;
  cancelScheduledNotification: (timeoutId: string) => void;
  
  // Stats
  getStats: () => { supported: boolean; permission: NotificationPermission; enabled: boolean };
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(true);

  // Initialize notification service
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await notificationService.initialize();
      const stats = notificationService.getNotificationStats();
      
      setIsSupported(stats.supported);
      setPermission(stats.permission);
      setIsEnabled(stats.enabled);
      
      if (success) {
        await loadNotifications();
        await loadPreferences();
      }
      
      return success;
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      setIsEnabled(newPermission === 'granted');
      return newPermission;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return 'denied';
    }
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async (): Promise<void> => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'budget_alert',
          title: 'Budget Overschreden',
          message: 'Je hebt 80% van je boodschappen budget bereikt deze maand.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          actionUrl: '/budgets'
        },
        {
          id: '2',
          type: 'savings_reminder',
          title: 'Spaarherinnering',
          message: 'Vergeet niet om €50 over te maken naar je spaarrekening deze week.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
          actionUrl: '/savings-goals'
        },
        {
          id: '3',
          type: 'goal_achieved',
          title: 'Doel Bereikt! 🎉',
          message: 'Gefeliciteerd! Je hebt je spaardoel van €1000 bereikt.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          read: true,
          actionUrl: '/savings-goals'
        },
        {
          id: '4',
          type: 'ai_advice',
          title: 'AI Financiële Tip',
          message: 'Gebaseerd op je uitgavenpatroon: overweeg om je abonnementen te herzien.',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          read: true,
          actionUrl: '/ai-coach'
        },
        {
          id: '5',
          type: 'spending_alert',
          title: 'Ongewone Uitgave',
          message: 'Je hebt €150 uitgegeven bij een nieuwe webshop. Is dit correct?',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          read: false,
          actionUrl: '/transactions'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  // Load preferences
  const loadPreferences = useCallback(async (): Promise<void> => {
    try {
      // Mock data - replace with actual API call
      const mockPreferences: NotificationPreference[] = [
        { type: 'budget_alert', enabled: true, frequency: 'immediate' },
        { type: 'savings_reminder', enabled: true, frequency: 'daily' },
        { type: 'spending_alert', enabled: true, frequency: 'immediate' },
        { type: 'goal_achieved', enabled: true, frequency: 'immediate' },
        { type: 'ai_advice', enabled: true, frequency: 'weekly' },
        { type: 'system', enabled: false, frequency: 'immediate' },
      ];
      setPreferences(mockPreferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    try {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      // API call to mark as read
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string): Promise<void> => {
    try {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      // API call to delete notification
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      // API call to mark all as read
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Update preference
  const updatePreference = useCallback(async (
    type: string, 
    field: keyof NotificationPreference, 
    value: any
  ): Promise<void> => {
    try {
      setPreferences(prev => 
        prev.map(pref => 
          pref.type === type ? { ...pref, [field]: value } : pref
        )
      );
      // API call to update preference
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (): Promise<PushSubscription | null> => {
    try {
      return await notificationService.subscribeToPushNotifications();
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    try {
      return await notificationService.unsubscribeFromPushNotifications();
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }, []);

  // Get push subscription
  const getPushSubscription = useCallback(async (): Promise<PushSubscription | null> => {
    try {
      return await notificationService.getPushSubscription();
    } catch (error) {
      console.error('Error getting push subscription:', error);
      return null;
    }
  }, []);

  // Schedule notification
  const scheduleNotification = useCallback(async (
    payload: PushNotificationPayload, 
    delay: number
  ): Promise<string> => {
    try {
      return await notificationService.scheduleNotification(payload, delay);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }, []);

  // Cancel scheduled notification
  const cancelScheduledNotification = useCallback((timeoutId: string): void => {
    notificationService.cancelScheduledNotification(timeoutId);
  }, []);

  // Get stats
  const getStats = useCallback(() => {
    return notificationService.getNotificationStats();
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    // State
    notifications,
    preferences,
    isEnabled,
    isSupported,
    permission,
    loading,
    
    // Actions
    initialize,
    requestPermission,
    sendNotification: notificationService.sendNotification.bind(notificationService),
    sendBudgetAlert: notificationService.sendBudgetAlert.bind(notificationService),
    sendSavingsReminder: notificationService.sendSavingsReminder.bind(notificationService),
    sendGoalAchieved: notificationService.sendGoalAchieved.bind(notificationService),
    sendSpendingAlert: notificationService.sendSpendingAlert.bind(notificationService),
    sendAIAdvice: notificationService.sendAIAdvice.bind(notificationService),
    sendSystemNotification: notificationService.sendSystemNotification.bind(notificationService),
    sendTestNotification: notificationService.sendTestNotification.bind(notificationService),
    
    // Notification management
    loadNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    
    // Preference management
    loadPreferences,
    updatePreference,
    
    // Push subscription
    subscribeToPush,
    unsubscribeFromPush,
    getPushSubscription,
    
    // Scheduling
    scheduleNotification,
    cancelScheduledNotification,
    
    // Stats
    getStats,
  };
}; 