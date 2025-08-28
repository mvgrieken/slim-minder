import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Slim Minder DB...');
  const user = await prisma.user.create({ data: {} });
  const defaults = ['Boodschappen', 'Uit eten', 'Vervoer', 'Abonnementen', 'Overig'];
  const categories = await Promise.all(defaults.map(name => prisma.category.create({ data: { userId: user.id, name } })));
  const cGroceries = categories.find(c => c.name === 'Boodschappen')!;
  const cDining = categories.find(c => c.name === 'Uit eten')!;
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const b1 = await prisma.budget.create({ data: { userId: user.id, categoryId: cGroceries.id, period: 'month', limit: 300, currency: 'EUR', startsOn: start, active: true } });
  const b2 = await prisma.budget.create({ data: { userId: user.id, categoryId: cDining.id, period: 'month', limit: 120, currency: 'EUR', startsOn: start, active: true } });
  await prisma.transaction.createMany({ data: [
    { userId: user.id, date: new Date(), amount: 45.5, currency: 'EUR', description: 'Supermarkt', merchant: 'Albert Heijn', categoryId: cGroceries.id },
    { userId: user.id, date: new Date(), amount: 28.0, currency: 'EUR', description: 'Lunch', merchant: 'Bistro', categoryId: cDining.id },
  ]});
  console.log('Done. Seeded user:', user.id);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });

