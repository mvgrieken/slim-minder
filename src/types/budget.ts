export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  alert_threshold: number;
  current_spent: number;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    color: string;
    icon: string;
  };
  // Computed fields for UI
  spent?: number;
  remaining?: number;
} 