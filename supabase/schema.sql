-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enums
CREATE TYPE account_tier AS ENUM ('FREE', 'CORE', 'PREMIUM');
CREATE TYPE risk_profile AS ENUM ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE');
CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT');
CREATE TYPE budget_period AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');
CREATE TYPE goal_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- User profiles table
CREATE TABLE user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    date_of_birth DATE NOT NULL,
    account_tier account_tier DEFAULT 'FREE',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    financial_goals JSONB,
    risk_profile risk_profile DEFAULT 'CONSERVATIVE',
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
    privacy_settings JSONB DEFAULT '{"share_data": false, "marketing": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank connections table
CREATE TABLE bank_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    connection_id TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency TEXT DEFAULT 'daily',
    account_type account_type NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    parent_id UUID REFERENCES categories(id),
    is_income BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_connection_id UUID REFERENCES bank_connections(id) ON DELETE CASCADE,
    transaction_id TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    subcategory TEXT,
    transaction_date DATE NOT NULL,
    processed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    merchant TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(3,2),
    is_verified BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bank_connection_id, transaction_id)
);

-- Budgets table
CREATE TABLE budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    period budget_period DEFAULT 'MONTHLY',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    alert_threshold DECIMAL(3,2) DEFAULT 0.80 CHECK (alert_threshold BETWEEN 0 AND 1),
    current_spent DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings goals table
CREATE TABLE savings_goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12,2) DEFAULT 0 CHECK (current_amount >= 0),
    target_date DATE,
    category TEXT NOT NULL,
    priority goal_priority DEFAULT 'MEDIUM',
    is_active BOOLEAN DEFAULT TRUE,
    auto_save_enabled BOOLEAN DEFAULT FALSE,
    auto_save_amount DECIMAL(12,2),
    progress_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN target_amount > 0 THEN LEAST((current_amount / target_amount) * 100, 100)
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification table
CREATE TABLE gamification (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    badges_earned JSONB DEFAULT '[]',
    challenges_completed JSONB DEFAULT '[]',
    achievements JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversations table
CREATE TABLE ai_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB,
    sentiment TEXT,
    topics TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_bank_connections_user_id ON bank_connections(user_id);
CREATE INDEX idx_bank_connections_is_active ON bank_connections(is_active);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_bank_connection_id ON transactions(bank_connection_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_is_active ON budgets(is_active);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_savings_goals_is_active ON savings_goals(is_active);
CREATE INDEX idx_gamification_user_id ON gamification(user_id);
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_session_id ON ai_conversations(session_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_connections_updated_at BEFORE UPDATE ON bank_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gamification_updated_at BEFORE UPDATE ON gamification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, color, icon, is_income, is_system, display_order) VALUES
-- Income categories
('Salaris', '#22c55e', 'salary', true, true, 1),
('Freelance', '#22c55e', 'freelance', true, true, 2),
('Investeringen', '#22c55e', 'investments', true, true, 3),
('Overig Inkomen', '#22c55e', 'other-income', true, true, 4),

-- Expense categories
('Boodschappen', '#ef4444', 'shopping-cart', false, true, 5),
('Transport', '#3b82f6', 'car', false, true, 6),
('Wonen', '#8b5cf6', 'home', false, true, 7),
('Utilities', '#eab308', 'zap', false, true, 8),
('Eten & Drinken', '#f97316', 'utensils', false, true, 9),
('Entertainment', '#ec4899', 'gamepad-2', false, true, 10),
('Gezondheid', '#10b981', 'heart', false, true, 11),
('Onderwijs', '#06b6d4', 'book-open', false, true, 12),
('Kleding', '#84cc16', 'shirt', false, true, 13),
('Verzekeringen', '#6366f1', 'shield', false, true, 14),
('Sparen', '#22c55e', 'piggy-bank', false, true, 15),
('Overig', '#6b7280', 'more-horizontal', false, true, 16);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bank connections policies
CREATE POLICY "Users can view own bank connections" ON bank_connections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bank connections" ON bank_connections FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view own budgets" ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

-- Savings goals policies
CREATE POLICY "Users can view own savings goals" ON savings_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own savings goals" ON savings_goals FOR ALL USING (auth.uid() = user_id);

-- Gamification policies
CREATE POLICY "Users can view own gamification" ON gamification FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own gamification" ON gamification FOR ALL USING (auth.uid() = user_id);

-- AI conversations policies
CREATE POLICY "Users can view own AI conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories are public (read-only for users)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, email, account_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nieuwe Gebruiker'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'account_tier')::account_tier, 'FREE')
  );
  
  INSERT INTO public.gamification (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 