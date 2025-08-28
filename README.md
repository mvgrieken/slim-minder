# Slim Minder Monorepo

Cross-platform app (iOS, Android, Web) with Expo, a TypeScript API, a background worker, and shared packages.

Slim Minder is een innovatieve gedragsgerichte budgetcoach-app die financieel kwetsbare huishoudens helpt om gezonder met geld om te gaan.

## Structure
- `apps/mobile`: Expo app (iOS/Android/Web)
- `apps/api`: TypeScript API (Express; can evolve to NestJS)
- `apps/worker`: Background worker (jobs, nudges)
- `packages/ui`: Shared UI components for React Native/Web
- `packages/types`: Shared TypeScript types (domain models)
- `packages/utils`: Shared utilities (formatting, helpers)

## Prerequisites
- Node.js >= 18.17
- npm (or pnpm/yarn)

## Install
From the repo root:

```
npm install
```

> Note: This repo is scaffolded without installing dependencies here. Run `npm install` locally to fetch packages.

Database (Postgres via Docker)

```
docker compose up -d
```

## Develop
- Mobile/Web (Expo):
  ```
  npm run dev:mobile
  ```
  - Optioneel: zet `EXPO_PUBLIC_API_URL` om naar je API (default: http://localhost:4000)
  - Monorepo is al geconfigureerd via `apps/mobile/metro.config.js` zodat shared packages werken
  - Supabase Auth (mobile): zet `EXPO_PUBLIC_SUPABASE_URL` en `EXPO_PUBLIC_SUPABASE_ANON_KEY` in je env (bv. via `app.config.js` of `.env` met Expo)
- API (Express TS):
  ```
  # In-memory store (default)
  npm run dev:api

  # Prisma/Postgres store (requires DB + prisma generate)
  # set USE_DB=true in apps/api/.env or your shell
  ```
- Worker:
  ```
  npm run dev:worker
  ```

## Environment
Create a `.env` at repo root or inside apps with the following placeholders:

```
# API
PORT=4000
NODE_ENV=development

# Open Banking (choose provider later)
OB_PROVIDER=tink
OB_CLIENT_ID=your_client_id
OB_CLIENT_SECRET=your_secret
OB_REDIRECT_URI=http://localhost:4000/callback
```

## Next
- Choose PSD2 aggregator (Tink/GoCardless/Nordigen/Budget Insight)
- Define data model in DB (PostgreSQL + Prisma)
- Implement account linking + webhooks
- Add push notifications (Expo)
- Implement budgets, goals, nudges, basic AI assistant API

## Database/Prisma
- Copy `.env.example` to `.env` and ensure `DATABASE_URL` is set
- Start DB: `docker compose up -d`
- Generate client: `cd apps/api && npm run prisma:generate`
- Apply migrations:
  - Dev: `npm run prisma:migrate` (creates and applies migrations)
  - Deploy: `npx prisma migrate deploy` (applies SQL in `prisma/migrations`)
- Seed dev data: `npm run prisma:seed`
- Use DB: set `USE_DB=true` in your env when running the API (default in `apps/api/.env.example` is true)

### Supabase (Remote Postgres)
- See `docs/supabase.md` for setup and connection string
- Example env: `apps/api/.env.supabase.example`
