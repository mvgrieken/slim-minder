# Data Model (Draft for Prisma)

Core entities for M1 (manual flows) and forward-compatible with PSD2.

## Entities
- User: minimal for M1 (guest id), extensible to full auth later.
- Category: user-scoped categories.
- Budget: monthly category budget.
- Transaction: manual (M1) + imported (M2+), user-scoped, categorized.
- Goal, Badge: M3.
- BankAccount, AccountLink: M2.
- NudgeRule, Notification: M3.

## Relations (high-level)
- User 1—N Category, Budget, Transaction, Goal, Badge, Notification
- Category 1—N Transaction, 1—N Budget
- User 1—N BankAccount; AccountLink ties provider consent to user

See apps/api/prisma/schema.prisma for field details.

