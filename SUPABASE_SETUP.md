# Supabase Setup voor Slim Minder Development

## Stap 1: Maak een Supabase Project aan

1. Ga naar [supabase.com](https://supabase.com)
2. Klik op "New Project"
3. Kies je organisatie
4. Vul project details in:
   - **Name**: `slim-minder-dev`
   - **Database Password**: Genereer een sterke wachtwoord
   - **Region**: Kies een regio dicht bij je (bijv. West Europe)

## Stap 2: Haal je API Keys op

1. Ga naar je project dashboard
2. Klik op "Settings" → "API"
3. Kopieer de volgende waarden:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Stap 3: Configureer je Environment

Maak een `.env.local` bestand aan in de root van je project:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mobile App Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Stap 4: Database Schema Setup

Het database schema wordt automatisch opgezet door Prisma. Voer uit:

```bash
npm run db:migrate
npm run db:seed
```

## Stap 5: Test de Verbinding

Start de API server:

```bash
npm run dev:api
```

Start de mobile app:

```bash
npm run dev:mobile
```

## Troubleshooting

- **CORS Error**: Controleer of je localhost origins zijn toegevoegd in Supabase
- **Auth Error**: Controleer of je API keys correct zijn gekopieerd
- **Database Error**: Controleer of je database URL correct is
