// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.USE_DB = 'false';

// PSD2/Tink configuration
process.env.TINK_CLIENT_ID = 'test-client-id';
process.env.TINK_CLIENT_SECRET = 'test-client-secret';
process.env.TINK_REDIRECT_URI = 'http://localhost:3000/api/bank/callback';
process.env.TINK_ENVIRONMENT = 'sandbox';

beforeAll(async () => {
  // Skip database connection for development/testing
  console.log('Test setup: Skipping database connection for development');
});

afterAll(async () => {
  // Skip database disconnection for development/testing
  console.log('Test cleanup: Skipping database disconnection for development');
});

afterEach(async () => {
  // Skip test data cleanup for development/testing
  console.log('Test cleanup: Skipping data cleanup for development');
});
