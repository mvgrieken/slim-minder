-- Slim Minder MVP Database Schema
-- Compatible with Supabase PostgreSQL
-- Includes Row Level Security (RLS) policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'nl',
  currency TEXT DEFAULT 'EUR',
  timezone TEXT DEFAULT 'Europe/Amsterdam',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories for expense classification
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📝',
  color TEXT DEFAULT '#6B7280',
  is_default BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Budgets per category
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'EUR',
  period TEXT DEFAULT 'month' CHECK (period IN ('week', 'month', 'quarter', 'year')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank accounts (for PSD2 integration)
CREATE TABLE public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- tink, gocardless, etc.
  provider_account_id TEXT NOT NULL,
  account_name TEXT,
  account_type TEXT, -- checking, savings, credit
  iban TEXT,
  currency TEXT DEFAULT 'EUR',
  last_sync_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Transactions (both manual and imported)
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  description TEXT,
  merchant_name TEXT,
  transaction_date DATE NOT NULL,
  type TEXT DEFAULT 'expense' CHECK (type IN ('income', 'expense', 'transfer')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'recurring')),
  provider_transaction_id TEXT, -- for imported transactions
  metadata JSONB,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial goals
CREATE TABLE public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(10,2) NOT NULL CHECK (target_amount > 0),
  current_amount DECIMAL(10,2) DEFAULT 0 CHECK (current_amount >= 0),
  currency TEXT DEFAULT 'EUR',
  target_date DATE,
  category TEXT, -- vacation, emergency, purchase, etc.
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  auto_contribute BOOLEAN DEFAULT FALSE,
  contribution_amount DECIMAL(10,2),
  contribution_frequency TEXT CHECK (contribution_frequency IN ('daily', 'weekly', 'monthly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements/Badges system
CREATE TABLE public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  criteria JSONB, -- rules for earning the badge
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications & nudges
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('budget_warning', 'goal_progress', 'badge_earned', 'tip', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  is_pushed BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- AI Chat interactions
CREATE TABLE public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nudge rules and triggers
CREATE TABLE public.nudge_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('budget_threshold', 'goal_reminder', 'spending_pattern', 'achievement')),
  conditions JSONB NOT NULL,
  action JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  notification_preferences JSONB DEFAULT '{"budget_alerts": true, "goal_reminders": true, "weekly_summary": true}',
  privacy_settings JSONB DEFAULT '{"data_sharing": false, "analytics": true}',
  app_settings JSONB DEFAULT '{"theme": "light", "currency_display": "symbol"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default categories seed data
INSERT INTO public.categories (id, user_id, name, icon, color, is_default) VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'Boodschappen', '🛒', '#10B981', TRUE),
  ('00000000-0000-0000-0000-000000000002', NULL, 'Transport', '🚗', '#3B82F6', TRUE),
  ('00000000-0000-0000-0000-000000000003', NULL, 'Restaurants', '🍽️', '#F59E0B', TRUE),
  ('00000000-0000-0000-0000-000000000004', NULL, 'Entertainment', '🎬', '#8B5CF6', TRUE),
  ('00000000-0000-0000-0000-000000000005', NULL, 'Kleding', '👕', '#EC4899', TRUE),
  ('00000000-0000-0000-0000-000000000006', NULL, 'Gezondheid', '🏥', '#EF4444', TRUE),
  ('00000000-0000-0000-0000-000000000007', NULL, 'Educatie', '📚', '#06B6D4', TRUE),
  ('00000000-0000-0000-0000-000000000008', NULL, 'Wonen', '🏠', '#84CC16', TRUE),
  ('00000000-0000-0000-0000-000000000009', NULL, 'Verzekeringen', '🛡️', '#6B7280', TRUE),
  ('00000000-0000-0000-0000-000000000010', NULL, 'Overig', '📝', '#6B7280', TRUE);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nudge_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Users can view own categories and defaults" ON public.categories 
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users can create own categories" ON public.categories 
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own categories" ON public.categories 
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own categories" ON public.categories 
  FOR DELETE USING (user_id = auth.uid());

-- Budgets policies
CREATE POLICY "Users can manage own budgets" ON public.budgets 
  FOR ALL USING (user_id = auth.uid());

-- Bank accounts policies
CREATE POLICY "Users can manage own bank accounts" ON public.bank_accounts 
  FOR ALL USING (user_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can manage own transactions" ON public.transactions 
  FOR ALL USING (user_id = auth.uid());

-- Goals policies
CREATE POLICY "Users can manage own goals" ON public.goals 
  FOR ALL USING (user_id = auth.uid());

-- Badges policies
CREATE POLICY "Users can view own badges" ON public.badges 
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create badges" ON public.badges 
  FOR INSERT WITH CHECK (TRUE); -- Allow system to create badges

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications 
  FOR ALL USING (user_id = auth.uid());

-- Chat policies
CREATE POLICY "Users can manage own chat sessions" ON public.chat_sessions 
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own chat messages" ON public.chat_messages 
  FOR ALL USING (user_id = auth.uid());

-- Nudge rules policies
CREATE POLICY "Users can manage own nudge rules" ON public.nudge_rules 
  FOR ALL USING (user_id = auth.uid());

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON public.user_preferences 
  FOR ALL USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_category_id ON public.budgets(category_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_transactions_category ON public.transactions(category_id);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id);

-- Trigger functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nudge_rules_updated_at BEFORE UPDATE ON public.nudge_rules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Create default categories for the user
  INSERT INTO public.categories (user_id, name, icon, color)
  SELECT new.id, name, icon, color
  FROM public.categories 
  WHERE user_id IS NULL;
  
  -- Create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Useful views for analytics
CREATE VIEW public.budget_progress AS
SELECT 
  b.id as budget_id,
  b.user_id,
  b.name as budget_name,
  c.name as category_name,
  b.amount as budget_amount,
  b.currency,
  b.period,
  b.start_date,
  COALESCE(SUM(ABS(t.amount)), 0) as spent_amount,
  b.amount - COALESCE(SUM(ABS(t.amount)), 0) as remaining_amount,
  CASE 
    WHEN b.amount > 0 THEN (COALESCE(SUM(ABS(t.amount)), 0) / b.amount * 100)::DECIMAL(5,2)
    ELSE 0
  END as progress_percentage
FROM public.budgets b
LEFT JOIN public.categories c ON c.id = b.category_id
LEFT JOIN public.transactions t ON t.category_id = b.category_id 
  AND t.user_id = b.user_id 
  AND t.type = 'expense'
  AND t.transaction_date >= b.start_date
  AND (b.end_date IS NULL OR t.transaction_date <= b.end_date)
WHERE b.is_active = TRUE
GROUP BY b.id, b.user_id, b.name, c.name, b.amount, b.currency, b.period, b.start_date;

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.categories IS 'Expense categories for transaction classification';
COMMENT ON TABLE public.budgets IS 'User budgets per category and time period';
COMMENT ON TABLE public.transactions IS 'All financial transactions (manual and imported)';
COMMENT ON TABLE public.goals IS 'User financial goals and savings targets';
COMMENT ON TABLE public.badges IS 'User achievements and gamification';
COMMENT ON TABLE public.notifications IS 'System notifications and nudges';
COMMENT ON TABLE public.chat_sessions IS 'AI chat conversation sessions';
COMMENT ON TABLE public.chat_messages IS 'Individual messages in AI chat sessions';
COMMENT ON VIEW public.budget_progress IS 'Real-time budget progress and spending analysis';