export interface Notification {
  id: string;
  type: 'budget_alert' | 'savings_reminder' | 'spending_alert' | 'goal_achieved' | 'ai_advice' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  data?: any;
}

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class NotificationService {
  private isSupported: boolean;
  private permission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  // Initialize notification service
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    try {
      // Register service worker for push notifications
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.serviceWorkerRegistration);

      // Request permission if not granted
      if (this.permission === 'default') {
        this.permission = await this.requestPermission();
      }

      return this.permission === 'granted';
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) return 'denied';

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Check if notifications are enabled
  isEnabled(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  // Send immediate notification
  async sendNotification(payload: PushNotificationPayload): Promise<boolean> {
    if (!this.isEnabled()) {
      console.warn('Notifications not enabled');
      return false;
    }

    try {
      // Try to use service worker for better control
      if (this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/logo192.png',
          badge: payload.badge || '/logo192.png',
          tag: payload.tag,
          data: payload.data,
          actions: payload.actions,
          requireInteraction: true,
          silent: false,
        });
      } else {
        // Fallback to basic notification
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/logo192.png',
          tag: payload.tag,
          data: payload.data,
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  // Send budget alert notification
  async sendBudgetAlert(category: string, percentage: number, amount: number): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'Budget Alert',
      body: `Je hebt ${percentage}% van je ${category} budget bereikt (€${amount.toFixed(2)})`,
      tag: 'budget_alert',
      data: { type: 'budget_alert', category, percentage, amount },
      actions: [
        {
          action: 'view_budget',
          title: 'Bekijk Budget',
        },
        {
          action: 'dismiss',
          title: 'Sluiten',
        },
      ],
    };

    return this.sendNotification(payload);
  }

  // Send savings reminder notification
  async sendSavingsReminder(goalName: string, amount: number): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'Spaarherinnering',
      body: `Vergeet niet om €${amount.toFixed(2)} over te maken naar je ${goalName} spaardoel`,
      tag: 'savings_reminder',
      data: { type: 'savings_reminder', goalName, amount },
      actions: [
        {
          action: 'view_savings',
          title: 'Bekijk Doelen',
        },
        {
          action: 'dismiss',
          title: 'Sluiten',
        },
      ],
    };

    return this.sendNotification(payload);
  }

  // Send goal achieved notification
  async sendGoalAchieved(goalName: string, amount: number): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'Doel Bereikt! 🎉',
      body: `Gefeliciteerd! Je hebt je ${goalName} spaardoel van €${amount.toFixed(2)} bereikt!`,
      tag: 'goal_achieved',
      data: { type: 'goal_achieved', goalName, amount },
      actions: [
        {
          action: 'view_savings',
          title: 'Bekijk Doelen',
        },
        {
          action: 'dismiss',
          title: 'Sluiten',
        },
      ],
    };

    return this.sendNotification(payload);
  }

  // Send spending alert notification
  async sendSpendingAlert(amount: number, merchant: string): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'Ongewone Uitgave',
      body: `Je hebt €${amount.toFixed(2)} uitgegeven bij ${merchant}. Is dit correct?`,
      tag: 'spending_alert',
      data: { type: 'spending_alert', amount, merchant },
      actions: [
        {
          action: 'view_transactions',
          title: 'Bekijk Transacties',
        },
        {
          action: 'dismiss',
          title: 'Sluiten',
        },
      ],
    };

    return this.sendNotification(payload);
  }

  // Send AI advice notification
  async sendAIAdvice(advice: string): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'AI Financiële Tip',
      body: advice,
      tag: 'ai_advice',
      data: { type: 'ai_advice', advice },
      actions: [
        {
          action: 'view_ai_coach',
          title: 'Bekijk Advies',
        },
        {
          action: 'dismiss',
          title: 'Sluiten',
        },
      ],
    };

    return this.sendNotification(payload);
  }

  // Send system notification
  async sendSystemNotification(title: string, message: string): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title,
      body: message,
      tag: 'system',
      data: { type: 'system' },
    };

    return this.sendNotification(payload);
  }

  // Schedule notification for later
  async scheduleNotification(
    payload: PushNotificationPayload,
    delay: number // milliseconds
  ): Promise<string> {
    if (!this.isEnabled()) {
      console.warn('Notifications not enabled');
      return '';
    }

    try {
      const timeoutId = setTimeout(() => {
        this.sendNotification(payload);
      }, delay);

      return timeoutId.toString();
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return '';
    }
  }

  // Cancel scheduled notification
  cancelScheduledNotification(timeoutId: string): void {
    try {
      clearTimeout(parseInt(timeoutId));
    } catch (error) {
      console.error('Error canceling scheduled notification:', error);
    }
  }

  // Subscribe to push notifications (for server-side sending)
  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) {
      console.warn('Service worker not registered');
      return null;
    }

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || ''),
      });

      console.log('Push subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPushNotifications(): Promise<boolean> {
    if (!this.serviceWorkerRegistration) {
      return false;
    }

    try {
      const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Unsubscribed from push notifications');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  // Get current push subscription
  async getPushSubscription(): Promise<PushSubscription | null> {
    if (!this.serviceWorkerRegistration) {
      return null;
    }

    try {
      return await this.serviceWorkerRegistration.pushManager.getSubscription();
    } catch (error) {
      console.error('Error getting push subscription:', error);
      return null;
    }
  }

  // Convert VAPID public key to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Test notification
  async sendTestNotification(): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'Test Notificatie',
      body: 'Dit is een test notificatie om te controleren of alles werkt.',
      tag: 'test',
      data: { type: 'test' },
    };

    return this.sendNotification(payload);
  }

  // Get notification statistics
  getNotificationStats(): {
    supported: boolean;
    permission: NotificationPermission;
    enabled: boolean;
  } {
    return {
      supported: this.isSupported,
      permission: this.permission,
      enabled: this.isEnabled(),
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 