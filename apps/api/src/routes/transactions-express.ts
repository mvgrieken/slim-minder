import express from 'express';
import { store } from '../store';

const router = express.Router();

// Get all transactions for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { from, to, categoryId, limit = '50', offset = '0' } = req.query;

    const filters: { from?: string; to?: string; categoryId?: string } = {};
    if (from) filters.from = from as string;
    if (to) filters.to = to as string;
    if (categoryId) filters.categoryId = categoryId as string;

    const transactions = await store.listTransactions(userId, filters);

    // Apply pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    const paginatedTransactions = transactions.slice(offsetNum, offsetNum + limitNum);

    res.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        total: transactions.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < transactions.length
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});

// Create a new transaction (manual entry)
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { description, amount, categoryId, date, merchant } = req.body;

    if (!description || amount === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Description and amount are required' 
      });
    }

    const transaction = await store.createTransaction(userId, {
      description: description,
      amount: parseFloat(amount),
      categoryId: categoryId || null,
      date: date || new Date().toISOString(),
      merchant: merchant || null,
      currency: 'EUR'
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to create transaction' });
  }
});

// Update a transaction
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { id } = req.params;
    const { description, categoryId, merchant } = req.body;

    const updatedTransaction = await store.updateTransaction(userId, id, {
      description: description,
      categoryId: categoryId,
      merchant: merchant
    });

    if (!updatedTransaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    res.json({ success: true, data: updatedTransaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to update transaction' });
  }
});

// Delete a transaction (only manual transactions)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { id } = req.params;

    await store.deleteTransaction(userId, id);
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to delete transaction' });
  }
});

// Get transaction statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { from, to } = req.query;

    const filters: { from?: string; to?: string } = {};
    if (from) filters.from = from as string;
    if (to) filters.to = to as string;

    const transactions = await store.listTransactions(userId, filters);

    // Calculate statistics
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netAmount = totalIncome - totalExpenses;

    // Category breakdown
    const categoryTotals: { [key: string]: number } = {};
    transactions.forEach(t => {
      if (t.amount < 0) { // Only expenses
        const category = t.categoryId || 'Uncategorized';
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(t.amount);
      }
    });

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netAmount,
        transactionCount: transactions.length,
        categoryBreakdown: categoryTotals
      }
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

export default router;
