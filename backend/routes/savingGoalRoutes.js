const express = require('express');
const router = express.Router();
const SavingGoal = require('../models/SavingGoal');
const protect = require('../middleware/authMiddleware');

// @route   POST /api/saving-goals
// @desc    Create a new savings goal for the authenticated user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, targetAmount } = req.body;

    const newSavingGoal = new SavingGoal({
      title,
      targetAmount,
      user: req.user.id,
    });

    const savedGoal = await newSavingGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error('Failed to add savings goal:', err);
    res.status(500).json({ error: 'Failed to add savings goal' });
  }
});

// @route   GET /api/saving-goals
// @desc    Get all savings goals for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const goals = await SavingGoal.find({ user: req.user.id });
    res.json(goals);
  } catch (err) {
    console.error('Failed to fetch savings goals:', err);
    res.status(500).json({ error: 'Failed to fetch savings goals' });
  }
});

// @route   PUT /api/saving-goals/:id
// @desc    Update a savings goal for the authenticated user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, targetAmount, currentAmount } = req.body;

    const updatedGoal = await SavingGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, targetAmount, currentAmount },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: 'Savings goal not found or you do not have permission to edit it' });
    }

    res.json(updatedGoal);
  } catch (err) {
    console.error('Failed to update savings goal:', err);
    res.status(500).json({ error: 'Failed to update savings goal' });
  }
});

// @route   DELETE /api/saving-goals/:id
// @desc    Delete a savings goal for the authenticated user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedGoal = await SavingGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedGoal) {
      return res.status(404).json({ error: 'Savings goal not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Savings goal deleted successfully' });
  } catch (err) {
    console.error('Failed to delete savings goal:', err);
    res.status(500).json({ error: 'Failed to delete savings goal' });
  }
});

module.exports = router;