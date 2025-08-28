# Slim Minder - Budgetcoach App 💰

Een innovatieve gedragsgerichte budgetcoach-app die financieel kwetsbare huishoudens helpt om gezonder met geld om te gaan. Gebouwd als cross-platform app voor iOS, Android en Web.

## 🏗️ Project Architectuur

### Technische Stack
- **Frontend**: React Native + Expo (TypeScript)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS via NativeWind
- **State Management**: React Hooks + Context API
- **Build System**: Expo CLI / EAS Build
- **Monorepo**: npm workspaces

### Project Structuur
```
slim-minder/
├── apps/
│   ├── mobile/          # React Native Expo app (iOS/Android/Web)
│   ├── api/            # TypeScript API (Express; can evolve to NestJS)
│   └── worker/         # Background worker (jobs, nudges)
├── packages/
│   ├── ui/             # Shared UI components
│   ├── types/          # Shared TypeScript types
│   └── utils/          # Shared utilities
├── docs/               # Documentation
└── supabase/           # Supabase migrations & functions
```

## 🚀 Quick Start

### Vereisten
- **Node.js** >= 18.17
- **npm** (of pnpm/yarn)
- **Expo CLI**: `npm install -g @expo/cli`
- **Docker** (voor lokale database)

### 1. Installatie
```bash
git clone https://github.com/mvgrieken/slim-minder.git
cd slim-minder
npm install
```

### 2. Environment Setup
```bash
# Kopieer environment template
cp .env.example .env

# Vul minimaal deze waarden in:
# - EXPO_PUBLIC_SUPABASE_URL
# - EXPO_PUBLIC_SUPABASE_ANON_KEY
# - DATABASE_URL (voor lokale development)
```

### 3. Database Setup

#### Optie A: Lokale Database (Aanbevolen voor development)
```bash
# Start PostgreSQL container
docker compose up -d

# Genereer Prisma client
cd apps/api
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

#### Optie B: Supabase (Production-ready)
1. Ga naar [supabase.com](https://supabase.com) → New Project
2. Kopieer Project URL en anon key naar `.env`
3. Zie `docs/supabase.md` voor gedetailleerde setup

### 4. Start Development

#### Mobile App (Expo)
```bash
npm run dev:mobile

# Of specifiek platform:
npm run dev:mobile -- --ios
npm run dev:mobile -- --android  
npm run dev:mobile -- --web
```

#### API Server
```bash
npm run dev:api
```

#### Background Worker
```bash
npm run dev:worker
```

## 📱 Functies (MVP)

### ✅ Geïmplementeerd
- **Dashboard** - Overzicht van budgetten en uitgaven
- **Budgettering** - Per categorie budgetten instellen
- **Transacties** - Handmatig uitgaven bijhouden
- **Categorieën** - Uitgaven categoriseren
- **Doelen** - Spaardoelen stellen en monitoren
- **Badges** - Gamification voor engagement
- **AI Coach** - Dummy chat interface voor budgetadvies

### 🔄 In Development
- **Supabase Integratie** - Volledige auth en data sync
- **PSD2 Bankkoppeling** - Automatische transactie import
- **Push Notificaties** - Budget waarschuwingen
- **AI Assistent** - Echte OpenAI/Claude integratie

### 📋 Geplanned
- **Open Banking** - Tink/GoCardless integratie  
- **Nudge Engine** - Slimme uitgaventips
- **Familieprofielen** - Gedeelde budgetten
- **Analytics Dashboard** - Uitgaventrends

## 🔧 Development

### Beschikbare Scripts

#### Root Level
```bash
npm run dev:mobile        # Start Expo development server
npm run dev:api          # Start Express API server  
npm run dev:worker       # Start background worker
npm run typecheck        # TypeScript type checking
npm run build           # Build all packages
npm run lint            # Lint all packages
```

#### Mobile App (`apps/mobile/`)
```bash
npm run start           # Start Expo
npm run typecheck       # TypeScript check
npm run build:ios       # Build iOS app (requires EAS)
npm run build:android   # Build Android app
npm run build:web       # Export web build
```

### Code Style & Kwaliteit

#### TypeScript
- **Strict mode** ingeschakeld
- **Type safety** verplicht
- Geen `any` types tenzij noodzakelijk

#### Styling
- **Tailwind CSS** via NativeWind
- Consistent design system met custom kleuren
- Responsive design voor alle platforms

#### Testing
```bash
# Unit tests
npm run test

# E2E tests (TODO)
npm run test:e2e
```

### Database Management

#### Prisma Commando's
```bash
cd apps/api

# Database migrations
npm run prisma:generate    # Genereer Prisma client
npm run prisma:migrate     # Run migrations  
npm run prisma:seed        # Seed test data
npm run prisma:studio      # Open Prisma Studio

# Reset database
npm run prisma:reset
```

#### Schema Wijzigingen
1. Edit `apps/api/prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Commit migration files

## 🌐 Deployment

### Mobile App
```bash
# iOS App Store
eas build --platform ios
eas submit --platform ios

# Google Play Store  
eas build --platform android
eas submit --platform android

# Web
npm run build:web
# Deploy dist/ folder to hosting service
```

### Backend
- **API**: Deploy to Railway/Heroku/DigitalOcean
- **Database**: Supabase managed PostgreSQL
- **Storage**: Supabase Storage voor uploads

## 🔐 Security & Privacy

### Client-Side
- ✅ Geen API keys in client code
- ✅ Supabase RLS (Row Level Security)
- ✅ JWT token validatie
- ✅ Input validatie met Zod

### Server-Side  
- ✅ Environment variables voor secrets
- ✅ CORS configuratie
- ✅ Rate limiting
- ✅ SQL injection bescherming via Prisma

## 🧪 Testing

### Development Testing
```bash
# TypeScript check
npm run typecheck

# Start development servers
npm run dev:mobile
npm run dev:api

# Test op verschillende platforms
# iOS: Simulator + fysiek device
# Android: Emulator + fysiek device  
# Web: Chrome, Safari, Firefox
```

### Handmatige Tests
1. **Registratie/Login flow**
2. **Budget aanmaken en wijzigen**
3. **Transacties toevoegen**
4. **Dashboard refresh**
5. **Cross-platform consistency**

## 📚 Documentatie

- `docs/functional-specs.txt` - Functionele specificaties
- `docs/supabase.md` - Supabase setup guide
- `docs/backlog.md` - Product backlog
- `MVP_PLAN.md` - MVP implementatie plan
- `STATUS_ANALYSIS.md` - Huidige status vs specs

## 🤝 Contributing

### Development Workflow
1. **Feature branch** van `main`
2. **Implementeer feature** met tests
3. **TypeScript check** + **manual testing**
4. **Pull request** met beschrijving
5. **Code review** + **deploy**

### Code Standards
- **Conventional commits** voor duidelijke history
- **TypeScript** strict mode
- **Tailwind** voor styling
- **Error boundaries** voor crash protection

## 🆘 Troubleshooting

### Common Issues

#### "Metro bundler not starting"
```bash
# Clear Metro cache
npx expo start --clear
```

#### "Supabase connection errors"
```bash
# Check environment variables
cat .env | grep SUPABASE

# Test connection
cd apps/api && npm run dev
```

#### "TypeScript errors"
```bash
# Regenerate types
cd apps/api && npm run prisma:generate
npm run typecheck
```

#### "Tailwind styles not working"
```bash
# Check babel config has nativewind plugin
cat apps/mobile/babel.config.js

# Restart Metro with clean cache
npx expo start --clear
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev:mobile
DEBUG=true npm run dev:api
```

## 📞 Support

Voor vragen of problemen:
1. Check de documentatie in `docs/`
2. Zoek in GitHub Issues
3. Create een nieuwe Issue met details
4. Voor urgent: contact development team

## 🎯 Roadmap

### Q1 2024
- [x] MVP foundation met basic functies
- [x] Modern UI met Tailwind
- [ ] Supabase volledige integratie
- [ ] iOS/Android app store deployment

### Q2 2024  
- [ ] PSD2 bankkoppeling
- [ ] AI coach met OpenAI integratie
- [ ] Push notificaties
- [ ] Advanced analytics

### Q3 2024
- [ ] Familieprofielen
- [ ] Nudge engine
- [ ] Community features
- [ ] Advanced gamification

---

**Slim Minder** - Helping households build healthier financial habits through behavioral coaching and smart technology. 💪💰
