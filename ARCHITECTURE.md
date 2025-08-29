# Slim Minder - Architecture Overview

## Domain Summary

Slim Minder is een gedragsgerichte budgetcoach-app die financieel kwetsbare huishoudens helpt om gezonder met geld om te gaan. De app biedt proactieve interventies in plaats van alleen achteraf inzicht.

## Core Entities

### Users & Authentication
- **Users**: Gebruikersprofielen met voorkeuren (easy mode, taalinstellingen)
- **Auth**: Supabase Auth voor email/password en OAuth
- **Profiles**: Uitgebreide gebruikersinformatie en instellingen

### Financial Data
- **Transactions**: Banktransacties via PSD2 integratie of handmatige invoer
- **Categories**: Gestandaardiseerde uitgavencategorieën (Nibud-richtlijnen)
- **Budgets**: Maandelijkse budgetten per categorie met real-time tracking
- **Goals**: Bespaar- en spaardoelen met voortgang tracking
- **SavingsPots**: Spaarpotten voor specifieke doelen

### Behavioral Features
- **Notifications**: Push notificaties voor budget waarschuwingen
- **ChatInteractions**: AI-coach gesprekken en context
- **Rewards**: Gamification badges en punten systeem
- **AI Context Cache**: Samenvattingen voor AI-coach personalisatie

## User Flows

### MVP Flows
1. **Onboarding**: Account aanmaken → Bank koppelen → Budgetten instellen
2. **Daily Usage**: Dashboard bekijken → Transacties categoriseren → Waarschuwingen ontvangen
3. **Goal Setting**: Doel instellen → Voortgang tracken → Badge verdienen
4. **AI Coaching**: Vraag stellen → Contextuele antwoorden → Feedback geven

### Persona-Specific Flows
- **Student**: Eerste budget opstellen → Template gebruiken → Community challenges
- **Gezinshoofd**: Meerdere budgetten → Gedeelde toegang → Gezinsdoelen
- **Senior**: Easy mode activeren → Grote uitgaven herinneringen → Eenvoudige interface

## Technical Architecture

### Frontend (React Native + Expo)
- **Platforms**: iOS, Android, Web (React Native Web)
- **Styling**: Tailwind CSS via NativeWind
- **State**: TanStack Query (server state) + React state/Zustand (local)
- **Routing**: Expo Router
- **Forms**: React Hook Form + Zod validation

### Backend (Supabase)
- **Database**: PostgreSQL met Row Level Security
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime voor live updates
- **Storage**: Supabase Storage voor assets

### Integrations
- **Banking**: PSD2 via Tink/Budget Insight
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **Notifications**: Expo Notifications + FCM/APNS
- **Analytics**: Sentry (optioneel)

## Security & Privacy

### Data Protection
- **Encryption**: Alle privacygevoelige data versleuteld
- **RLS**: Row Level Security voor data isolatie
- **GDPR**: EU-gebaseerde data opslag
- **PSD2**: Veilige bank integratie

### Access Control
- **Authentication**: Supabase Auth met JWT tokens
- **Authorization**: Role-based access per gebruiker
- **Audit**: Logging van alle kritieke acties

## Performance Targets

### Web Performance
- **Bundle Size**: ≤ 300KB gzipped (app code, excl. vendor)
- **TTI**: < 3s op mid-range laptop
- **Lighthouse**: 90+ scores voor performance, accessibility

### Mobile Performance
- **App Size**: < 50MB download
- **Startup Time**: < 2s cold start
- **Offline**: Basis functionaliteit zonder internet

## Scalability Considerations

### Database
- **Indexing**: Strategische indexes op veel-gebruikte queries
- **Partitioning**: Transacties per gebruiker/maand
- **Caching**: Redis voor frequent-gebruikte data

### API
- **Rate Limiting**: Per gebruiker en endpoint
- **Caching**: CDN voor statische assets
- **Monitoring**: Real-time performance tracking

## Development Phases

### Phase 0: Foundation
- Repo setup, tooling, linting, TypeScript config
- Basic project structure en scripts

### Phase 1: App Skeleton
- Expo Router setup
- Basic navigation en providers
- Home screen en routing

### Phase 2: Authentication
- Supabase Auth integratie
- Session management
- Protected routes

### Phase 3: Core Features
- Database schema en migrations
- CRUD operaties voor budgetten/transacties
- Basic UI components

### Phase 4: Advanced Features
- PSD2 integratie
- AI coach implementatie
- Push notifications

### Phase 5: Polish & Deploy
- UI/UX verfijning
- Performance optimalisatie
- Production deployment

## Technology Stack

### Core
- **Runtime**: Node.js 20+
- **Language**: TypeScript (strict mode)
- **Framework**: React Native + Expo
- **Styling**: Tailwind CSS + NativeWind

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **API**: Supabase REST + Realtime
- **Storage**: Supabase Storage

### Development
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions + Netlify

### Monitoring
- **Error Tracking**: Sentry (optioneel)
- **Analytics**: Custom events
- **Logging**: Structured logging
- **Health Checks**: Endpoint monitoring
