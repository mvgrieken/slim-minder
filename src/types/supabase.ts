export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          phone_number: string | null
          date_of_birth: string
          account_tier: 'FREE' | 'CORE' | 'PREMIUM'
          onboarding_completed: boolean
          financial_goals: Json | null
          risk_profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
          notification_preferences: Json
          privacy_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          email: string
          phone_number?: string | null
          date_of_birth: string
          account_tier?: 'FREE' | 'CORE' | 'PREMIUM'
          onboarding_completed?: boolean
          financial_goals?: Json | null
          risk_profile?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
          notification_preferences?: Json
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          phone_number?: string | null
          date_of_birth?: string
          account_tier?: 'FREE' | 'CORE' | 'PREMIUM'
          onboarding_completed?: boolean
          financial_goals?: Json | null
          risk_profile?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
          notification_preferences?: Json
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      bank_connections: {
        Row: {
          id: string
          user_id: string
          bank_name: string
          account_number_masked: string
          connection_id: string
          is_active: boolean
          last_sync: string | null
          sync_frequency: string
          account_type: 'CHECKING' | 'SAVINGS' | 'CREDIT'
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bank_name: string
          account_number_masked: string
          connection_id: string
          is_active?: boolean
          last_sync?: string | null
          sync_frequency?: string
          account_type: 'CHECKING' | 'SAVINGS' | 'CREDIT'
          balance: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bank_name?: string
          account_number_masked?: string
          connection_id?: string
          is_active?: boolean
          last_sync?: string | null
          sync_frequency?: string
          account_type?: 'CHECKING' | 'SAVINGS' | 'CREDIT'
          balance?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          bank_connection_id: string
          transaction_id: string
          amount: number
          currency: string
          description: string
          category_id: string | null
          subcategory: string | null
          transaction_date: string
          processed_date: string
          merchant: string | null
          is_recurring: boolean
          confidence_score: number | null
          is_verified: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bank_connection_id: string
          transaction_id: string
          amount: number
          currency?: string
          description: string
          category_id?: string | null
          subcategory?: string | null
          transaction_date: string
          processed_date: string
          merchant?: string | null
          is_recurring?: boolean
          confidence_score?: number | null
          is_verified?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bank_connection_id?: string
          transaction_id?: string
          amount?: number
          currency?: string
          description?: string
          category_id?: string | null
          subcategory?: string | null
          transaction_date?: string
          processed_date?: string
          merchant?: string | null
          is_recurring?: boolean
          confidence_score?: number | null
          is_verified?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          icon: string
          parent_id: string | null
          is_income: boolean
          is_system: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          icon: string
          parent_id?: string | null
          is_income?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          icon?: string
          parent_id?: string | null
          is_income?: boolean
          is_system?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string
          name: string
          amount: number
          period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          start_date: string
          end_date: string | null
          is_active: boolean
          alert_threshold: number
          current_spent: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          name: string
          amount: number
          period?: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          start_date: string
          end_date?: string | null
          is_active?: boolean
          alert_threshold?: number
          current_spent?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          name?: string
          amount?: number
          period?: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          alert_threshold?: number
          current_spent?: number
          created_at?: string
          updated_at?: string
        }
      }
      savings_goals: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          target_amount: number
          current_amount: number
          target_date: string | null
          category: string
          priority: 'LOW' | 'MEDIUM' | 'HIGH'
          is_active: boolean
          auto_save_enabled: boolean
          auto_save_amount: number | null
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          target_amount: number
          current_amount?: number
          target_date?: string | null
          category: string
          priority?: 'LOW' | 'MEDIUM' | 'HIGH'
          is_active?: boolean
          auto_save_enabled?: boolean
          auto_save_amount?: number | null
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          target_amount?: number
          current_amount?: number
          target_date?: string | null
          category?: string
          priority?: 'LOW' | 'MEDIUM' | 'HIGH'
          is_active?: boolean
          auto_save_enabled?: boolean
          auto_save_amount?: number | null
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      gamification: {
        Row: {
          id: string
          user_id: string
          total_points: number
          level: number
          experience_points: number
          streak_days: number
          last_activity: string
          badges_earned: Json
          challenges_completed: Json
          achievements: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          level?: number
          experience_points?: number
          streak_days?: number
          last_activity?: string
          badges_earned?: Json
          challenges_completed?: Json
          achievements?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          level?: number
          experience_points?: number
          streak_days?: number
          last_activity?: string
          badges_earned?: Json
          challenges_completed?: Json
          achievements?: Json
          created_at?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          session_id: string
          message: string
          response: string
          context: Json | null
          sentiment: string | null
          topics: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          message: string
          response: string
          context?: Json | null
          sentiment?: string | null
          topics?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          message?: string
          response?: string
          context?: Json | null
          sentiment?: string | null
          topics?: string[] | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_tier: 'FREE' | 'CORE' | 'PREMIUM'
      risk_profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
      account_type: 'CHECKING' | 'SAVINGS' | 'CREDIT'
      budget_period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
      goal_priority: 'LOW' | 'MEDIUM' | 'HIGH'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 