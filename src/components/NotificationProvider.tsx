import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useApp } from '../contexts/AppContext';

interface NotificationContextType {
  sendBudgetAlert: (category: string, percentage: number, amount: number) => Promise<boolean>;
  sendSavingsReminder: (goalName: string, amount: number) => Promise<boolean>;
  sendGoalAchieved: (goalName: string, amount: number) => Promise<boolean>;
  sendSpendingAlert: (amount: number, merchant: string) => Promise<boolean>;
  sendAIAdvice: (advice: string) => Promise<boolean>;
  sendSystemNotification: (title: string, message: string) => Promise<boolean>;
  isEnabled: boolean;
  isSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    isEnabled,
    isSupported,
    sendBudgetAlert,
    sendSavingsReminder,
    sendGoalAchieved,
    sendSpendingAlert,
    sendAIAdvice,
    sendSystemNotification,
  } = useNotifications();

  const { budgets, savingsGoals, transactions } = useApp();

  // Monitor budgets for alerts
  useEffect(() => {
    if (!isEnabled || !budgets) return;

    budgets.forEach(budget => {
      const spent = budget.current_spent ?? 0;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      // Send alerts at 80%, 90%, and 100%
      if (percentage >= 80 && percentage < 90) {
        sendBudgetAlert(budget.categories?.name || budget.name, Math.round(percentage), spent);
      } else if (percentage >= 90 && percentage < 100) {
        sendBudgetAlert(budget.categories?.name || budget.name, Math.round(percentage), spent);
      } else if (percentage >= 100) {
        sendBudgetAlert(budget.categories?.name || budget.name, Math.round(percentage), spent);
      }
    });
  }, [budgets, isEnabled, sendBudgetAlert]);

  // Monitor savings goals for reminders and achievements
  useEffect(() => {
    if (!isEnabled || !savingsGoals) return;
    
    savingsGoals.forEach(goal => {
      // Check if goal is achieved
      if (goal.current_amount >= goal.target_amount) {
        sendGoalAchieved(goal.name, goal.target_amount);
      }
      
      // Check for weekly reminders (simplified logic)
      const daysSinceLastReminder = 7; // Simplified for now
      
      if (daysSinceLastReminder >= 7 && goal.current_amount < goal.target_amount) {
        const monthlyNeeded = 50; // Default to 50 if not set
        sendSavingsReminder(goal.name, monthlyNeeded);
      }
    });
  }, [savingsGoals, isEnabled, sendGoalAchieved, sendSavingsReminder]);

  // Monitor transactions for unusual spending
  useEffect(() => {
    if (!isEnabled || !transactions) return;

    // Get recent transactions (last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentTransactions = transactions.filter(t => 
      new Date(t.transaction_date) > oneDayAgo && t.amount < 0
    );

    // Check for unusual spending patterns
    recentTransactions.forEach(transaction => {
      const amount = Math.abs(transaction.amount);
      
      // Alert for transactions over €100 from new merchants
      if (amount > 100) {
        // Check if this is a new merchant (simplified logic)
        const merchantTransactions = transactions.filter(t =>
          t.description === transaction.description
        );
        
        if (merchantTransactions.length === 1) {
          sendSpendingAlert(amount, transaction.description);
        }
      }
    });
  }, [transactions, isEnabled, sendSpendingAlert]);

  // Daily AI advice reminder
  useEffect(() => {
    if (!isEnabled) return;

    const checkDailyAdvice = () => {
      const lastAdvice = localStorage.getItem('lastAIAdvice');
      const now = new Date();
      
      if (!lastAdvice || (now.getTime() - new Date(lastAdvice).getTime()) > 24 * 60 * 60 * 1000) {
        const advice = getRandomAdvice();
        sendAIAdvice(advice);
        localStorage.setItem('lastAIAdvice', now.toISOString());
      }
    };

    // Check on mount
    checkDailyAdvice();

    // Set up daily check
    const interval = setInterval(checkDailyAdvice, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [isEnabled, sendAIAdvice]);

  // Get random financial advice
  const getRandomAdvice = (): string => {
    const adviceList = [
      "Overweeg om je abonnementen te herzien - je kunt mogelijk geld besparen.",
      "Probeer deze week €10 extra te sparen door een kleine uitgave te skippen.",
      "Bekijk je uitgaven van vorige maand om patronen te herkennen.",
      "Stel een automatische spaaroverboeking in voor consistentie.",
      "Plan je maandelijkse uitgaven vooruit om verrassingen te voorkomen.",
      "Vergelijk prijzen voordat je grote aankopen doet.",
      "Houd je spaardoelen in gedachten bij elke uitgave.",
      "Overweeg om een noodfonds op te bouwen voor onverwachte kosten.",
      "Track je dagelijkse uitgaven voor een week om bewustwording te creëren.",
      "Stel realistische budgetten in die je kunt volhouden."
    ];
    
    return adviceList[Math.floor(Math.random() * adviceList.length)];
  };

  // Welcome notification for new users
  useEffect(() => {
    const isNewUser = !localStorage.getItem('hasSeenWelcome');
    
    if (isNewUser && isEnabled) {
      sendSystemNotification(
        'Welkom bij Slim Minder! 🎉',
        'Start met het instellen van je budgetten en spaardoelen voor optimale financiële controle.'
      );
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [isEnabled, sendSystemNotification]);

  const contextValue: NotificationContextType = {
    sendBudgetAlert,
    sendSavingsReminder,
    sendGoalAchieved,
    sendSpendingAlert,
    sendAIAdvice,
    sendSystemNotification,
    isEnabled,
    isSupported,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}; 