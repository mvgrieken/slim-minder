import 'dotenv/config';
import type { Store } from './types';
import { memoryStore } from './memory';
import { prismaStore } from './prisma';

const useDb = process.env.USE_DB === 'true';

export const store: Store = useDb ? prismaStore : memoryStore;
