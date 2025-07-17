export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  bank_transaction_id?: string;
  created_at: string;
} 