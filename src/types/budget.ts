export interface Budget {
  id: string;
  user_id: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  period: 'monthly' | 'weekly' | 'yearly';
  created_at: string;
} 