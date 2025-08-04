import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const SavingGoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchGoals = async () => {
    try {
      const response = await axios.get('${API_URL}/api/saving-goals');
      setGoals(response.data);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      showToast('Failed to load savings goals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    if(e) e.preventDefault();
    if (!title || !targetAmount) {
      showToast('Please fill in both fields.', 'error');
      return;
    }

    try {
      const res = await axios.post('${API_URL}/api/saving-goals', {
        title,
        targetAmount: parseFloat(targetAmount),
      });
      setGoals([...goals, res.data]);
      showToast('Goal saved successfully!', 'success');
      setTitle('');
      setTargetAmount('');
    } catch (err) {
      console.error('Failed to save goal:', err);
      showToast(err.response?.data?.error || 'Failed to save goal.', 'error');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/saving-goals/${id}`);
      setGoals(goals.filter(goal => goal._id !== id));
      showToast('Goal deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete goal:', err);
      showToast('Failed to delete goal.', 'error');
    }
  };

  const handleUpdateCurrentAmount = async (goal) => {
    const newCurrentAmount = prompt(`Enter new current amount for "${goal.title}":`);
    if (newCurrentAmount === null || isNaN(newCurrentAmount)) {
      return;
    }

    const updatedGoal = {
      ...goal,
      currentAmount: parseFloat(newCurrentAmount),
    };

    try {
      const res = await axios.put(`${API_URL}/api/saving-goals/${goal._id}`, updatedGoal);
      setGoals(goals.map(g => (g._id === res.data._id ? res.data : g)));
      showToast('Goal progress updated!', 'success');
    } catch (err) {
      console.error('Failed to update goal progress:', err);
      showToast('Failed to update goal progress.', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-lg font-semibold mb-4">🎯 Savings Goals</h2>
      
      {/* Form to add a new goal */}
      <form onSubmit={handleAddGoal} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Goal Title (e.g., New Laptop)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Target Amount (₹)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition"
        >
          Set New Goal
        </button>
      </form>

      {/* List of goals */}
      {loading ? (
        <p>Loading goals...</p>
      ) : goals.length === 0 ? (
        <p className="text-gray-500">No savings goals set yet.</p>
      ) : (
        <ul className="space-y-4">
          {goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progress >= 100;

            return (
              <li key={goal._id} className="p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <span className={`text-sm font-medium ${isCompleted ? 'text-green-500' : 'text-yellow-500'}`}>
                    {isCompleted ? 'Completed' : `${Math.round(progress)}%`}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, progress)}%`,
                      backgroundColor: isCompleted ? '#34d399' : '#facc15'
                    }}
                  />
                </div>
                
                <p className="text-sm mt-2 flex justify-between">
                  <span>Current: ₹{goal.currentAmount}</span>
                  <span>Target: ₹{goal.targetAmount}</span>
                </p>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleUpdateCurrentAmount(goal)}
                    className="text-indigo-500 hover:text-indigo-600 transition"
                  >
                    Add Funds
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SavingGoalTracker;