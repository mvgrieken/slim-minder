export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  is_active: boolean;
  auto_save_enabled?: boolean;
  auto_save_amount?: number;
  progress_percentage?: number;
  created_at: string;
  updated_at: string;
} 