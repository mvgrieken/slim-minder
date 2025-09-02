import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 4000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Simple health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Slim Minder API server running'
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', api: 'running' });
});

// Mock data endpoints (tijdelijk)
app.get('/api/transactions', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        description: 'Albert Heijn',
        amount: -45.67,
        category: 'Boodschappen',
        date: '2025-08-31',
        type: 'expense'
      },
      {
        id: '2',
        description: 'Salaris',
        amount: 2500.00,
        category: 'Inkomen',
        date: '2025-08-28',
        type: 'income'
      }
    ]
  });
});

app.get('/api/budgets', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        category: 'Boodschappen',
        limit: 400,
        spent: 345.67,
        period: 'month'
      },
      {
        id: '2',
        category: 'Transport',
        limit: 200,
        spent: 115.00,
        period: 'month'
      }
    ]
  });
});

app.get('/api/goals', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Nieuwe Laptop',
        targetAmount: 1200,
        currentAmount: 450,
        deadline: '2025-12-31',
        type: 'save'
      }
    ]
  });
});

// Bank endpoints (mock)
app.get('/api/bank/accounts', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'demo-account-1',
        name: 'ING Bank',
        type: 'checking',
        balance: 1250.50,
        currency: 'EUR'
      },
      {
        id: 'demo-account-2',
        name: 'ING Spaarrekening',
        type: 'savings',
        balance: 5000.00,
        currency: 'EUR'
      }
    ]
  });
});

app.post('/api/bank/connect', (req, res) => {
  res.json({
    success: true,
    data: {
      authUrl: 'https://example.com/auth'
    }
  });
});

// AI endpoints (mock)
app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    success: true,
    data: {
      response: `AI Coach: Ik heb je bericht "${message}" ontvangen. Dit is een mock response voor development.`,
      timestamp: new Date().toISOString()
    }
  });
});

console.log('🔄 Starting Slim Minder API server with mock routes...');

app.listen(PORT, () => {
  console.log(`🚀 Slim Minder API server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Transactions: http://localhost:${PORT}/api/transactions`);
  console.log(`🔗 Budgets: http://localhost:${PORT}/api/budgets`);
  console.log(`🔗 Goals: http://localhost:${PORT}/api/goals`);
  console.log(`🔗 Bank accounts: http://localhost:${PORT}/api/bank/accounts`);
  console.log(`🔗 AI chat: POST http://localhost:${PORT}/api/ai/chat`);
});
