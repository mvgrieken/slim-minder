-- Test data voor Slim Minder dashboard
-- Voer dit uit in je Supabase SQL Editor

-- 1. Test gebruiker (als je nog geen user hebt)
INSERT INTO auth.users (id, email, created_at, updated_at)
VALUES (
  'test-user-id-123',
  'test@example.com',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Test transacties voor huidige maand
INSERT INTO transactions (user_id, amount, description, category, transaction_date, created_at)
VALUES 
  -- Inkomsten
  ('test-user-id-123', 3200, 'Salaris januari', 'Salaris', '2024-01-15', NOW()),
  ('test-user-id-123', 150, 'Freelance project', 'Inkomen', '2024-01-20', NOW()),
  
  -- Uitgaven
  ('test-user-id-123', -450, 'Albert Heijn boodschappen', 'Boodschappen', '2024-01-05', NOW()),
  ('test-user-id-123', -320, 'NS treinkaartje', 'Vervoer', '2024-01-10', NOW()),
  ('test-user-id-123', -280, 'Bioscoop en eten', 'Vrije tijd', '2024-01-12', NOW()),
  ('test-user-id-123', -800, 'Huur appartement', 'Wonen', '2024-01-01', NOW()),
  ('test-user-id-123', -120, 'Benzine tanken', 'Vervoer', '2024-01-18', NOW()),
  ('test-user-id-123', -200, 'Kleding H&M', 'Vrije tijd', '2024-01-22', NOW()),
  ('test-user-id-123', -180, 'Jumbo boodschappen', 'Boodschappen', '2024-01-25', NOW()),
  ('test-user-id-123', -95, 'Netflix en Spotify', 'Vrije tijd', '2024-01-28', NOW());

-- 3. Test budgetten
INSERT INTO budgets (user_id, category, amount, period, created_at)
VALUES 
  ('test-user-id-123', 'Boodschappen', 500, 'monthly', NOW()),
  ('test-user-id-123', 'Vervoer', 400, 'monthly', NOW()),
  ('test-user-id-123', 'Vrije tijd', 300, 'monthly', NOW()),
  ('test-user-id-123', 'Wonen', 800, 'monthly', NOW()),
  ('test-user-id-123', 'Inkomen', 0, 'monthly', NOW());

-- 4. Test spaardoelen
INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline, created_at)
VALUES 
  ('test-user-id-123', 'Noodfonds', 5000, 1500, '2024-12-31', NOW()),
  ('test-user-id-123', 'Vakantie Bali', 3000, 800, '2024-06-30', NOW()),
  ('test-user-id-123', 'Nieuwe laptop', 1200, 400, '2024-03-31', NOW());

-- 5. Controleer de data
SELECT 'Transacties:' as info;
SELECT category, SUM(amount) as total, COUNT(*) as count 
FROM transactions 
WHERE user_id = 'test-user-id-123' 
GROUP BY category;

SELECT 'Budgetten:' as info;
SELECT category, amount, period 
FROM budgets 
WHERE user_id = 'test-user-id-123';

SELECT 'Spaardoelen:' as info;
SELECT name, target_amount, current_amount, deadline 
FROM savings_goals 
WHERE user_id = 'test-user-id-123'; 