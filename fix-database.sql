-- Slim Minder Database Fix Script
-- Execute these commands in Supabase SQL Editor to fix user registration

-- 1. Check if user_profiles table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'user_profiles';

-- 2. Create user_profiles table if not exists
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    account_tier TEXT DEFAULT 'FREE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- 5. Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Fix the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, email, account_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nieuwe Gebruiker'),
    NEW.email,
    'FREE'
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail user creation
  RAISE WARNING 'Failed to create user profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Check categories table
SELECT COUNT(*) FROM categories;

-- 9. If categories is empty, insert default categories
INSERT INTO categories (name, color, icon, is_income, is_system, display_order) VALUES
('Boodschappen', '#ef4444', 'shopping-cart', false, true, 5),
('Transport', '#3b82f6', 'car', false, true, 6),
('Wonen', '#8b5cf6', 'home', false, true, 7),
('Eten & Drinken', '#f97316', 'utensils', false, true, 9),
('Entertainment', '#ec4899', 'gamepad-2', false, true, 10),
('Overig', '#6b7280', 'more-horizontal', false, true, 16)
ON CONFLICT (name) DO NOTHING;

-- 10. Verify everything is set up correctly
SELECT 'user_profiles table', COUNT(*) FROM user_profiles
UNION ALL
SELECT 'categories table', COUNT(*) FROM categories
UNION ALL  
SELECT 'triggers', COUNT(*) FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';