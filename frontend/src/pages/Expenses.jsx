import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/PageHeader"; // ✅ Import new component

const API_URL = import.meta.env.VITE_API_URL;

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const { showToast } = useToast();

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/expenses`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      showToast("Error fetching expenses.", "error");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [showToast]);

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      showToast("Expense deleted successfully!", "success");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      showToast("Failed to delete expense.", "error");
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/expenses/export-csv`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my-expenses.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast("Expenses exported successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      const errorMessage = error.response?.data?.error || "Failed to export expenses.";
      showToast(errorMessage, "error");
    }
  };

  return (
    <div className="space-y-6 relative">
      <PageHeader title="💸 All Expenses">
        <button
          onClick={handleExportCsv}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Export to CSV
        </button>
      </PageHeader>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id} className="border-b dark:border-gray-700">
                <td className="p-2">{expense.title}</td>
                <td className="p-2">₹{expense.amount}</td>
                <td className="p-2">{expense.category}</td>
                <td className="p-2">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;