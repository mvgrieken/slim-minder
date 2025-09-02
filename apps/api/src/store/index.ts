import 'dotenv/config';
import type { Store } from './types';
import { memoryStore } from './memory';

// Force memory store for tests to prevent any database connections
const useDb = process.env.USE_DB === 'true' && process.env.NODE_ENV !== 'test';

let prismaStore: Store | null = null;

// Lazy load prisma store only when needed
function getPrismaStore(): Store {
  if (!prismaStore) {
    // Only import prisma store if we're not in test mode
    if (process.env.NODE_ENV === 'test') {
      return memoryStore;
    }
    try {
      const { prismaStore: store } = require('./prisma');
      prismaStore = store;
    } catch (error) {
      console.warn('Failed to load Prisma store, falling back to memory store:', error);
      return memoryStore;
    }
  }
  return prismaStore;
}

export const store: Store = useDb ? getPrismaStore() : memoryStore;
