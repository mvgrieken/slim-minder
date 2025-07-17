export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  description?: string;
  created_at: string;
} 