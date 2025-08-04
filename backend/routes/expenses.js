const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/authMiddleware');

// Add a new expense
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    
    const newExpense = new Expense({
      title,
      amount,
      category,
      user: req.user.id
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error('Failed to add expense:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Get all expenses for the authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Failed to fetch expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Update an expense by ID for the authenticated user
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, amount, category },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found or you do not have permission to edit it' });
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error('Failed to update expense:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE an expense by ID for the authenticated user
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Failed to delete expense:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// GET /api/expenses/export-csv - Protected route to export expenses
router.get('/export-csv', protect, async (req, res) => {
  console.log('✅ Export CSV route hit'); // ✅ Log to confirm this route is executed
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: 1 });

    if (expenses.length === 0) {
      return res.status(404).json({ error: 'No expenses found to export' });
    }

    // Create the CSV content
    const header = 'Title,Amount,Category,Date\n';
    const rows = expenses.map(expense => 
      `${expense.title},${expense.amount},${expense.category},${expense.date.toISOString()}`
    ).join('\n');
    const csv = header + rows;

    // Set headers to trigger file download
    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    res.send(csv);

  } catch (err) {
    console.error('Failed to export expenses to CSV:', err);
    res.status(500).json({ error: 'Failed to export expenses' });
  }
});

module.exports = router;