import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from '../context/ToastContext';
import { Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const BudgetManager = ({ expenses }) => {
  const [budgets, setBudgets] = useState([]); // ✅ Now an array of objects
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const { showToast } = useToast();

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('${API_URL}/api/budgets');
      setBudgets(response.data);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
      showToast("Failed to fetch budgets.", "error");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSave = async (e) => {
    if(e) e.preventDefault();
    if (!category || !amount) {
      showToast("Please fill in both fields.", "error");
      return;
    }

    const existingBudget = budgets.find(b => b.category.toLowerCase() === category.toLowerCase());
    
    try {
      if (existingBudget) {
        // Update existing budget
        const res = await axios.put(`${API_URL}/api/budgets/${existingBudget._id}`, {
          category,
          amount: parseFloat(amount),
        });
        setBudgets(budgets.map(b => (b._id === res.data._id ? res.data : b)));
        showToast("Budget updated successfully!", "success");
      } else {
        // Create new budget
        const res = await axios.post('${API_URL}/api/budgets', {
          category,
          amount: parseFloat(amount),
        });
        setBudgets([...budgets, res.data]);
        showToast("Budget saved successfully!", "success");
      }
      setCategory("");
      setAmount("");
    } catch (err) {
      console.error("Failed to save budget:", err);
      showToast(err.response?.data?.error || "Failed to save budget.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/budgets/${id}`);
      setBudgets(budgets.filter(b => b._id !== id));
      showToast("Budget deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete budget:", err);
      showToast("Failed to delete budget.", "error");
    }
  };

  const getSpentByCategory = (cat) =>
    (expenses || [])
      .filter((expense) => expense.category.toLowerCase() === cat.toLowerCase())
      .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-lg font-semibold mb-4">💼 Set Category Budgets</h2>

      {/* 🔧 Input Section */}
      <form onSubmit={handleSave} className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Category (e.g., Food)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Budget Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto transition-colors"
        >
          Save Budget
        </button>
      </form>

      {/* 📋 Budget Display */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">📋 Current Budgets</h3>
        {budgets.length === 0 ? (
          <p className="text-gray-500">No budgets set yet.</p>
        ) : (
          <ul className="text-sm text-gray-700 dark:text-gray-300">
            {budgets.map((budget) => {
              const spent = getSpentByCategory(budget.category);
              const over = spent > budget.amount;

              return (
                <li
                  key={budget._id}
                  className={`flex items-center justify-between mb-2 p-2 rounded-lg ${
                    over ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"
                  }`}
                >
                  <span className={`${over ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}`}>
                    {budget.category}: ₹{spent} / ₹{budget.amount} {over && "⚠️ Over Budget"}
                  </span>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="ml-4 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;