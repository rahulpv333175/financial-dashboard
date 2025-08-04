import React, { useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion"; // ✅ Import motion

const ExpenseTable = ({ expenses, setExpenses, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      showToast("Expense deleted successfully!", "success");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      showToast("Something went wrong while deleting.", "error");
    }
  };
  
  const filtered = expenses.filter((exp) => {
    const lower = searchTerm.toLowerCase();
    return (
      exp.title.toLowerCase().includes(lower) ||
      exp.category.toLowerCase().includes(lower) ||
      exp.amount.toString().includes(lower)
    );
  });

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">📋 Expense History</h2>

      <input
        type="text"
        placeholder="Search expenses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      />

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white dark:bg-gray-800 text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr className="border-b dark:border-gray-700">
                <td colSpan="5" className="px-6 py-4 text-center">
                  No matching expenses found.
                </td>
              </tr>
            ) : (
              filtered.map((exp, index) => (
                <motion.tr
                  key={exp._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4">{exp.title}</td>
                  <td className="px-6 py-4">₹{exp.amount}</td>
                  <td className="px-6 py-4">{exp.category}</td>
                  <td className="px-6 py-4">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
                      onClick={() => onEdit(exp)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                      onClick={() => handleDelete(exp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;