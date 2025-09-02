import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Slim Minder API is running!'
  });
});

// Mock API endpoints
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

app.post('/api/bank/connect', (req, res) => {
  res.json({
    success: true,
    data: {
      authUrl: 'https://example.com/auth'
    }
  });
});

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Slim Minder Simple API server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API base: http://localhost:${PORT}/api`);
});
