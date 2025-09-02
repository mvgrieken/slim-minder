import express from 'express';
import { store } from '../store';

const router = express.Router();

// Get all goals for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const goals = await store.getGoals(userId);

    // Calculate progress for each goal
    const goalsWithProgress = goals.map(goal => {
      const progress = goal.progress_amount || 0;
      const percentage = goal.target_amount > 0 ? (progress / goal.target_amount) * 100 : 0;
      const remaining = goal.target_amount - progress;
      const isAchieved = progress >= goal.target_amount;
      const isOverdue = new Date() > new Date(goal.end_on) && !isAchieved;

      return {
        ...goal,
        progress_percentage: percentage,
        remaining_amount: remaining,
        is_achieved: isAchieved,
        is_overdue: isOverdue,
        status: isAchieved ? 'achieved' : isOverdue ? 'failed' : 'active'
      };
    });

    res.json({ success: true, data: goalsWithProgress });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch goals' });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { 
      kind, 
      title, 
      target_amount, 
      baseline_hint, 
      start_on, 
      end_on 
    } = req.body;

    if (!kind || !title || !target_amount || !end_on) {
      return res.status(400).json({ 
        success: false, 
        error: 'Kind, title, target amount, and end date are required' 
      });
    }

    // Goal creation not implemented yet
    const goal: any = {
      user_id: userId,
      kind: kind as 'save' | 'reduce',
      title,
      target_amount: parseFloat(target_amount),
      baseline_hint: baseline_hint || null,
      start_on: start_on || new Date().toISOString().split('T')[0],
      end_on,
      status: 'active',
      progress_amount: 0
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ success: false, error: 'Failed to create goal' });
  }
});

// Update a goal
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { id } = req.params;
    const { 
      title, 
      target_amount, 
      baseline_hint, 
      end_on, 
      progress_amount,
      status 
    } = req.body;

    // Goal functionality not implemented in store yet
    const goal: any = null;
    if (!goal || goal.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    const updatedGoal = await store.updateGoal(id, {
      title: title || goal.title,
      target_amount: target_amount ? parseFloat(target_amount) : goal.target_amount,
      baseline_hint: baseline_hint || goal.baseline_hint,
      end_on: end_on || goal.end_on,
      progress_amount: progress_amount ? parseFloat(progress_amount) : goal.progress_amount,
      status: status || goal.status
    });

    res.json({ success: true, data: updatedGoal });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ success: false, error: 'Failed to update goal' });
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { id } = req.params;

    // Goal functionality not implemented in store yet
    const goal: any = null;
    if (!goal || goal.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    // Goal deletion not implemented yet
    res.json({ success: true, message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ success: false, error: 'Failed to delete goal' });
  }
});

// Update goal progress
router.post('/:id/progress', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount is required' 
      });
    }

    // Goal functionality not implemented in store yet
    const goal: any = null;
    if (!goal || goal.user_id !== userId) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }

    const newProgress = goal.progress_amount + parseFloat(amount);
    const isAchieved = newProgress >= goal.target_amount;

    const updatedGoal = await store.updateGoal(id, {
      progress_amount: newProgress,
      status: isAchieved ? 'achieved' : goal.status
    });

    res.json({ 
      success: true, 
      data: updatedGoal,
      message: isAchieved ? 'Goal achieved! 🎉' : 'Progress updated'
    });
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ success: false, error: 'Failed to update goal progress' });
  }
});

// Get goal statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.headers['x-sm-user-id'] as string || 'default-user';
    const goals = await store.getGoals(userId);

    const stats = {
      total: goals.length,
      active: goals.filter(g => g.status === 'active').length,
      achieved: goals.filter(g => g.status === 'achieved').length,
      failed: goals.filter(g => g.status === 'failed').length,
      totalTargetAmount: goals.reduce((sum, g) => sum + g.target_amount, 0),
      totalProgressAmount: goals.reduce((sum, g) => sum + (g.progress_amount || 0), 0),
      averageProgress: goals.length > 0 
        ? (goals.reduce((sum, g) => sum + (g.progress_amount || 0), 0) / 
           goals.reduce((sum, g) => sum + g.target_amount, 0)) * 100 
        : 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching goal stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch goal statistics' });
  }
});

export default router;
