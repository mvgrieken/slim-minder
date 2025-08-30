import { prisma } from '../prisma';

// Mock environment variables for testing
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.OPENAI_API_KEY = 'test-openai-key';

beforeAll(async () => {
  // Connect to test database
  try {
    await prisma.$connect();
  } catch (error) {
    console.warn('Could not connect to test database:', error);
  }
});

afterAll(async () => {
  // Disconnect from test database
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.warn('Could not disconnect from test database:', error);
  }
});

afterEach(async () => {
  // Clean up test data
  try {
    // Delete test data in reverse order of dependencies
    await prisma.chatInteraction.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.warn('Could not clean up test data:', error);
  }
});
