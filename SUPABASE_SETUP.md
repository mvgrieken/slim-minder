# Supabase Setup Guide

## 🔧 **Stap 1: Maak .env bestand aan**

Maak een `.env` bestand aan in de root van je project met de volgende inhoud:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🔑 **Stap 2: Haal je Supabase credentials op**

1. Ga naar [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecteer je project
3. Ga naar **Settings** → **API**
4. Kopieer de volgende waarden:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** key → `REACT_APP_SUPABASE_ANON_KEY`

## 📝 **Voorbeeld .env bestand:**

```env
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example_key_here
```

## 🗄️ **Stap 3: Voer database schema uit**

1. Ga naar je Supabase project
2. Open **SQL Editor**
3. Voer het volgende SQL uit:

```sql
-- Gebruikers tabel
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transacties tabel
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  transaction_date DATE NOT NULL,
  bank_transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Budgetten tabel
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  period VARCHAR(10) DEFAULT 'monthly',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Spaardoelen tabel
CREATE TABLE savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 **Stap 4: Voeg testdata toe**

Voer het SQL script uit uit `scripts/seed-data.sql` om testdata toe te voegen.

## 🚀 **Stap 5: Test de app**

1. Herstart je development server: `npm start`
2. Ga naar `http://localhost:3000/db-test`
3. Test de database connectie

## ❌ **Veelvoorkomende problemen:**

### **"supabaseUrl is required"**
- Controleer of je `.env` bestand bestaat
- Controleer of de variabelen correct zijn gespeld
- Herstart de development server na het aanmaken van `.env`

### **"Invalid API key"**
- Controleer of je de juiste anon key gebruikt (niet de service_role key)
- Controleer of je project URL correct is

### **"Table does not exist"**
- Controleer of je het database schema hebt uitgevoerd
- Controleer of de tabelnamen correct zijn

## 📞 **Hulp nodig?**

Als je problemen hebt:
1. Controleer de browser console voor errors
2. Controleer de Supabase logs in je dashboard
3. Zorg dat je project actief is in Supabase 