const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const protect = require('../middleware/authMiddleware');

// @route   POST /api/reminders
// @desc    Create a new reminder for the authenticated user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, dueDate } = req.body;

    const newReminder = new Reminder({
      title,
      dueDate,
      user: req.user.id,
    });

    const savedReminder = await newReminder.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    console.error('Failed to add reminder:', err);
    res.status(500).json({ error: 'Failed to add reminder' });
  }
});

// @route   GET /api/reminders
// @desc    Get all reminders for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.json(reminders);
  } catch (err) {
    console.error('Failed to fetch reminders:', err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// @route   PUT /api/reminders/:id
// @desc    Update a reminder for the authenticated user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, dueDate, isCompleted } = req.body;

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, dueDate, isCompleted },
      { new: true, runValidators: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({ error: 'Reminder not found or you do not have permission to edit it' });
    }

    res.json(updatedReminder);
  } catch (err) {
    console.error('Failed to update reminder:', err);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder for the authenticated user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedReminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedReminder) {
      return res.status(404).json({ error: 'Reminder not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    console.error('Failed to delete reminder:', err);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

module.exports = router;