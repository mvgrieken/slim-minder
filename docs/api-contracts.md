# API Contracts (M1 Draft)

Base URL: `/` (dev), version: v0 (no path prefix yet)
Auth: guest user-id header `x-sm-user-id` (M1) • JSON everywhere

## Health
- GET `/health` → 200 `{ status: 'ok' }`

## Users (M1 guest)
- POST `/users/guest` → 201 `{ id }`
- GET `/me` → 200 `{ id, createdAt }` (by `x-sm-user-id`)

## Categories
- GET `/categories` → 200 `Category[]`
- POST `/categories` body `{ name, icon? }` → 201 `Category`
- PATCH `/categories/:id` body `{ name?, icon?, archived? }` → 200 `Category`
- DELETE `/categories/:id` → 204

## Budgets
- GET `/budgets` → 200 `Budget[]`
- POST `/budgets` body `{ categoryId, limit, currency, startsOn }` → 201 `Budget`
- PATCH `/budgets/:id` body `{ limit?, currency?, active? }` → 200 `Budget`
- DELETE `/budgets/:id` → 204

## Transactions (manual)
- GET `/transactions?from&to&categoryId?` → 200 `Transaction[]`
- POST `/transactions` body `{ amount, currency, date, categoryId, description?, merchant? }` → 201 `Transaction`
- PATCH `/transactions/:id` body partial → 200 `Transaction`
- DELETE `/transactions/:id` → 204

## Progress (derived)
- GET `/progress/budgets?periodStart=YYYY-MM-01` → 200 `Array<{ budgetId, spent, limit, ratio }>`

See `packages/types` for shared shapes; all IDs are strings (UUID).

