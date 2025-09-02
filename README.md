# Slim Minder

Een innovatieve gedragsgerichte budgetcoach-app die financieel kwetsbare huishoudens helpt om gezonder met geld om te gaan.

## 🚀 Getting Started

### Vereisten
- **Node.js**: v22.17.1 (gebruik `.nvmrc` voor automatische versie switching)
- **npm**: v10.9.2 of hoger
- **Expo CLI**: `npm install -g @expo/cli`

### Installatie

```bash
# Clone de repository
git clone https://github.com/slimminder/slim-minder.git
cd slim-minder

# Installeer dependencies (met geoptimaliseerde settings)
npm install --no-audit --no-fund

# Of voor een clean install:
npm run clean:install
```

### Development

```bash
# Start alle services
npm run dev:all

# Of individueel:
npm run dev:mobile    # Mobile app (Expo)
npm run dev:api       # API server
npm run dev:worker    # Background worker
```

### Build

```bash
# Web build (terminating)
npm run build:web

# Mobile builds
npm run build:mobile

# API build
npm run build:api
```

### Environment Variables

Maak een `.env.local` bestand aan in `apps/api/`:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/slim_minder_dev

# PSD2/Tink
TINK_CLIENT_ID=your_tink_client_id
TINK_CLIENT_SECRET=your_tink_client_secret
TINK_REDIRECT_URI=https://console.tink.com/callback
TINK_ENVIRONMENT=sandbox

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### Troubleshooting

#### npm install hangt
```bash
# Clean install met geoptimaliseerde settings
$env:CI="1"; $env:ADBLOCK="1"; $env:HUSKY="0"; npm install --no-audit --no-fund
```

#### build:web hangt
```bash
# Verbose build met debug info
npm run build:web:verbose
```

#### Node versie problemen
```bash
# Gebruik de juiste Node versie
nvm use 22.17.1
```

## 📱 Apps

- **Mobile**: React Native + Expo app
- **API**: Express.js backend met Prisma
- **Worker**: Background job processor

## 🛠 Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL (via Supabase)
- **PSD2**: Tink API integratie
- **AI**: OpenAI GPT-4
- **Auth**: Supabase Auth

## 📄 Licentie

MIT
