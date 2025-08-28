import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  ob: {
    provider: (process.env.OB_PROVIDER || 'mock') as 'tink' | 'gocardless' | 'nordigen' | 'budget-insight' | 'mock',
    clientId: process.env.OB_CLIENT_ID || '',
    clientSecret: process.env.OB_CLIENT_SECRET || '',
    redirectUri: process.env.OB_REDIRECT_URI || 'http://localhost:4000/callback'
  }
};

