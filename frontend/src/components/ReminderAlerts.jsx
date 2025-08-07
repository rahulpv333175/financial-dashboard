import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { Trash2, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const ReminderAlerts = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reminders`);
      setReminders(response.data);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
      showToast('Failed to load reminders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleAddReminder = async (e) => {
    if(e) e.preventDefault();
    if (!title || !dueDate) {
      showToast('Please fill in both fields.', 'error');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/reminders`, {
        title,
        dueDate,
      });
      setReminders([...reminders, res.data]);
      showToast('Reminder added successfully!', 'success');
      setTitle('');
      setDueDate('');
    } catch (err) {
      console.error('Failed to add reminder:', err);
      showToast(err.response?.data?.error || 'Failed to add reminder.', 'error');
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/reminders/${id}`);
      setReminders(reminders.filter(reminder => reminder._id !== id));
      showToast('Reminder deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      showToast('Failed to delete reminder.', 'error');
    }
  };

  const handleToggleComplete = async (reminder) => {
    try {
      const updatedReminder = { ...reminder, isCompleted: !reminder.isCompleted };
      const res = await axios.put(`${API_URL}/api/reminders/${reminder._id}`, updatedReminder);
      setReminders(reminders.map(r => (r._id === res.data._id ? res.data : r)));
      showToast(`Reminder "${reminder.title}" marked as ${res.data.isCompleted ? 'completed' : 'pending'}.`, 'success');
    } catch (err) {
      console.error('Failed to update reminder:', err);
      showToast('Failed to update reminder.', 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-lg font-semibold mb-4">🔔 Reminder Alerts</h2>
      
      {/* Form to add a new reminder */}
      <form onSubmit={handleAddReminder} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Reminder Title (e.g., Pay Rent)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition"
        >
          Add Reminder
        </button>
      </form>

      {/* List of reminders */}
      {loading ? (
        <p>Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <p className="text-gray-500">No reminders set yet.</p>
      ) : (
        <ul className="space-y-4">
          {reminders.map(reminder => (
            <li
              key={reminder._id}
              className={`flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-700 ${
                reminder.isCompleted ? 'bg-gray-200 dark:bg-gray-600 opacity-70' : ''
              }`}
            >
              <div className="flex-1 flex flex-col">
                <span className={`font-semibold ${reminder.isCompleted ? 'line-through' : ''}`}>{reminder.title}</span>
                <span className={`text-sm text-gray-500 dark:text-gray-400 ${reminder.isCompleted ? 'line-through' : ''}`}>
                  Due: {new Date(reminder.dueDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleComplete(reminder)}
                  className="p-1 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-500"
                >
                  <CheckCircle size={16} color={reminder.isCompleted ? 'green' : 'currentColor'}/>
                </button>
                <button
                  onClick={() => handleDeleteReminder(reminder._id)}
                  className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReminderAlerts;