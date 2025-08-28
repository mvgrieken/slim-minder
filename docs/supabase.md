# Supabase Setup (Remote Postgres)

This repo can use Supabase as the production Postgres. Prisma works fine with Supabase.

## 1) Create Supabase Project
- Go to supabase.com → New Project
- Choose region and password
- Wait for the project to be provisioned

## 2) Get Connection String
- Dashboard → Project Settings → Database → Connection string → URI
- It looks like:
  `postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT.supabase.co:5432/postgres?schema=public`
- Add `sslmode=require` at the end for Prisma over SSL:
  `...postgres?schema=public&sslmode=require`

## 3) Configure API env
- Copy `apps/api/.env.supabase.example` to `apps/api/.env`
- Paste your connection string in `DATABASE_URL`
- Ensure `USE_DB=true`
- Set `SUPABASE_JWT_SECRET` (Dashboard → Project Settings → API → JWT Secret)
- Set `AUTH_OPTIONAL=false` in production to require JWT on all requests

## 4) Apply Prisma
From repo root (or `apps/api`):

```
npm install
cd apps/api
npm run prisma:generate
npm run prisma:migrate
# optional demo data
npm run prisma:seed
```

This runs our SQL migration (`prisma/migrations/0001_init`) on Supabase.

## 5) Run API
```
cd apps/api
npm run dev
```

Your mobile app should now persist to Supabase.

## Notes
- Extensions: the migration enables `pgcrypto` (for `gen_random_uuid()`), which is supported on Supabase. If it fails, re-run with a user that can create extensions (the default `postgres` user works).
- Pooling: for serverless environments use the Supabase connection pooler port (`6543`) and consider `pgbouncer=true`; for a long-running Node API, the standard port (5432) is fine.
- RLS: we don't enable Row Level Security yet; our API handles auth. If you later want Supabase Auth + RLS, we can evolve the API to validate Supabase JWTs and enable policies.
