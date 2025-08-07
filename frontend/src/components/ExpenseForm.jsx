import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const API_URL = import.meta.env.VITE_API_URL;

function ExpenseForm({ onAdd, onUpdate, editingExpense, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
    } else {
      setTitle('');
      setAmount('');
      setCategory('');
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
    };

    try {
      let res;
      if (editingExpense) {
        // Handle update
        res = await axios.put(`${API_URL}/api/expenses/${editingExpense._id}`, expenseData);
        if (res.status === 200) {
          showToast('Expense updated successfully!', 'success');
          onUpdate(res.data);
        } else {
          showToast(res.data.error || 'Failed to update expense', 'error');
        }
      } else {
        // Handle add
        res = await axios.post('${API_URL}/api/expenses', expenseData);
        if (res.status === 201) {
          showToast('Expense added successfully!', 'success');
          onAdd(res.data);
        } else {
          showToast(res.data.error || 'Failed to add expense', 'error');
        }
      }

      if (res && (res.status === 201 || res.status === 200)) {
        setTitle('');
        setAmount('');
        setCategory('');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Server error';
      showToast(errorMessage, 'error');
      console.error('Error:', err);
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          required
        />
        <input
          type="text"
          placeholder="Category (e.g., Food, Travel)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          required
        />
        <div className="flex justify-between items-center gap-4">
          {editingExpense && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`w-full text-white py-2 px-4 rounded-md hover:opacity-90 transition ${editingExpense ? 'bg-green-600' : 'bg-indigo-600'}`}
          >
            {editingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;