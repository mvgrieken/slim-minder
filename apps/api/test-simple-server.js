#!/usr/bin/env node

import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🧪 Starting simple test server...');

const app = express();
const PORT = 4000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Simple test server running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
