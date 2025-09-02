import express from 'express';
import { store } from '../store';

const router = express.Router();

// Get all budgets for a user
router.get('/', async (req, res) => {
  try {
    const userId = (req.headers['x-sm-user-id'] as string) || 'default-user';
    const budgets = await store.listBudgets(userId);
    const transactions = await store.listTransactions(userId);
    const now = new Date();
    const startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1); // monthly

    const budgetsWithSpending = budgets.map((budget) => {
      const spending = transactions
        .filter((t) => {
          const txDate = new Date(t.date);
          return (
            txDate >= startOfPeriod && t.amount < 0 && t.categoryId === budget.categoryId
          );
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return {
        ...budget,
        spent: spending,
        remaining: budget.limit - spending,
        percentage: budget.limit > 0 ? (spending / budget.limit) * 100 : 0,
      };
    });

    res.json({ success: true, data: budgetsWithSpending });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch budgets' });
  }
});

// Create a new budget
router.post('/', async (req, res) => {
  try {
    const userId = (req.headers['x-sm-user-id'] as string) || 'default-user';
    const { categoryId, limit, period = 'month', startsOn } = req.body || {};

    if (!categoryId || typeof limit === 'undefined') {
      return res
        .status(400)
        .json({ success: false, error: 'Category and limit amount are required' });
    }

    const budget = await store.createBudget(userId, {
      categoryId,
      limit: Number(limit),
      period: period as 'month',
      currency: 'EUR',
      startsOn: startsOn || new Date().toISOString().slice(0, 10),
      active: true,
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ success: false, error: 'Failed to create budget' });
  }
});

// Update a budget
router.patch('/:id', async (req, res) => {
  try {
    const userId = (req.headers['x-sm-user-id'] as string) || 'default-user';
    const { id } = req.params;
    const { limit, period, startsOn, active } = req.body || {};

    const updatedBudget = await store.updateBudget(userId, id, {
      limit: typeof limit === 'undefined' ? undefined : Number(limit),
      period,
      currency: undefined,
      startsOn,
      active,
    });

    if (!updatedBudget) {
      return res.status(404).json({ success: false, error: 'Budget not found' });
    }

    res.json({ success: true, data: updatedBudget });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ success: false, error: 'Failed to update budget' });
  }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const userId = (req.headers['x-sm-user-id'] as string) || 'default-user';
    const { id } = req.params;

    await store.deleteBudget(userId, id);
    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ success: false, error: 'Failed to delete budget' });
  }
});

// Get budget alerts (budgets that are close to or over limit)
router.get('/alerts', async (req, res) => {
  try {
    const userId = (req.headers['x-sm-user-id'] as string) || 'default-user';
    const thresholdPct = Number((req.query?.threshold as string) ?? '0.9');

    const [budgets, transactions] = await Promise.all([
      store.listBudgets(userId),
      store.listTransactions(userId),
    ]);

    const now = new Date();
    const startOfPeriod = new Date(now.getFullYear(), now.getMonth(), 1);

    const alerts = budgets
      .map((budget) => {
        const spending = transactions
          .filter((t) => {
            const txDate = new Date(t.date);
            return (
              txDate >= startOfPeriod && t.amount < 0 && t.categoryId === budget.categoryId
            );
          })
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const percentage = budget.limit > 0 ? (spending / budget.limit) * 100 : 0;

        if (percentage >= thresholdPct * 100) {
          return {
            budgetId: budget.id,
            categoryId: budget.categoryId,
            limit: budget.limit,
            spent: spending,
            percentage,
            alertType: percentage >= 100 ? 'over' : 'warning',
            message:
              percentage >= 100
                ? `Budget voor ${budget.categoryId} is overschreden`
                : `Budget voor ${budget.categoryId} is bijna op (${percentage.toFixed(1)}%)`,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error fetching budget alerts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch budget alerts' });
  }
});

export default router;
