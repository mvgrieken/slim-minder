import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    auth?: {
      provider: 'supabase' | 'dev' | 'none';
      raw?: any;
    };
  }
}

