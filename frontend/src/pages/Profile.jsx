import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/PageHeader"; // ✅ Import new component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ username: '', email: '' });
  const { showToast } = useToast();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile");
      setUser(response.data);
      setEditFormData({ username: response.data.username, email: response.data.email });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showToast("Failed to fetch user profile.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [showToast]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        editFormData
      );
      setUser(response.data);
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(error.response?.data?.error || "Failed to update profile.", "error");
    }
  };

  const handleChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="👤 Profile"> {/* ✅ Use new component */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        )}
      </PageHeader>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">User Information</h3>
        {isLoading ? (
          <p>Loading user data...</p>
        ) : user ? (
          !isEditing ? (
            // Read-only view
            <>
              <p className="mb-2"><strong>Username:</strong> {user.username}</p>
              <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            </>
          ) : (
            // Edit form view
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )
        ) : (
          <p>User data not available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;