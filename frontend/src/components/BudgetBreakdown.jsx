import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const API_URL = import.meta.env.VITE_API_URL;

const BudgetBreakdown = ({ expenses }) => {
  const [budgets, setBudgets] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get('${API_URL}/api/budgets');
        setBudgets(response.data);
      } catch (err) {
        console.error("Failed to fetch budgets:", err);
        showToast("Failed to load budgets.", "error");
      }
    };
    fetchBudgets();
  }, []);

  const spentPerCategory = (expenses || []).reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-lg font-semibold mb-4">📈 Budget vs Actual</h2>
      {Object.keys(spentPerCategory).length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No expenses found.</p>
      ) : (
        Object.entries(spentPerCategory).map(([category, spent]) => {
          const budgetObj = budgets.find(b => b.category.toLowerCase() === category.toLowerCase());
          const budget = budgetObj ? budgetObj.amount : 0;
          const percentUsed = budget ? Math.min(100, (spent / budget) * 100) : 0;
          const over = spent > budget;

          return (
            <div key={category} className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{category}</span>
                <span className={over ? "text-red-500" : "text-green-500"}>
                  ₹{spent} / ₹{budget || "N/A"}
                </span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    over ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default BudgetBreakdown;