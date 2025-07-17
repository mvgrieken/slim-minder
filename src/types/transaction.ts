export interface Transaction {
  id: string;
  user_id: string;
  bank_connection_id?: string;
  transaction_id?: string;
  amount: number;
  currency: string;
  description: string;
  category_id?: string;
  subcategory?: string;
  transaction_date: string;
  processed_date?: string;
  merchant?: string;
  is_recurring?: boolean;
  confidence_score?: number;
  is_verified?: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  categories?: {
    name: string;
    color: string;
    icon: string;
  };
} 