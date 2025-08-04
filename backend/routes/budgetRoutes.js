const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const protect = require('../middleware/authMiddleware');

// @route   POST /api/budgets
// @desc    Create a new budget for the authenticated user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { category, amount } = req.body;

    const newBudget = new Budget({
      category,
      amount,
      user: req.user.id,
    });

    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    console.error('Failed to add budget:', err);
    res.status(500).json({ error: 'Failed to add budget' });
  }
});

// @route   GET /api/budgets
// @desc    Get all budgets for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    console.error('Failed to fetch budgets:', err);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update a budget for the authenticated user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { category, amount } = req.body;

    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { category, amount },
      { new: true, runValidators: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ error: 'Budget not found or you do not have permission to edit it' });
    }

    res.json(updatedBudget);
  } catch (err) {
    console.error('Failed to update budget:', err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget for the authenticated user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedBudget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!deletedBudget) {
      return res.status(404).json({ error: 'Budget not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    console.error('Failed to delete budget:', err);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

module.exports = router;