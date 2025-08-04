import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import axios from "axios"
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";

import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Expenses from "./pages/Expenses"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import { ToastProvider } from './context/ToastContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ New state for sidebar
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsSidebarOpen(false); // Close sidebar on logout
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'bg-gray-950 text-white' : 'bg-pink-100 text-black'}`}>
        <ToastProvider>
          <Router>
            {isLoggedIn && (
              <>
                {/* Mobile Header */}
                <div className="flex justify-between items-center p-4 md:hidden border-b border-gray-300 dark:border-gray-700">
                  <span className="text-xl font-bold">💰 FinDash</span>
                  <button onClick={toggleSidebar} className="p-2 rounded-full">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black opacity-50 z-30"
                    onClick={toggleSidebar}
                  ></div>
                )}
                
                <Sidebar 
                  darkMode={darkMode} 
                  setDarkMode={setDarkMode} 
                  handleLogout={handleLogout} 
                  isSidebarOpen={isSidebarOpen} // Pass open state to Sidebar
                  toggleSidebar={toggleSidebar} // Pass toggle function to Sidebar
                />
              </>
            )}

            {/* Main Content Area */}
            <main className="flex-1 p-4 overflow-auto">
              <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/expenses" element={isLoggedIn ? <Expenses /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
              </Routes>
            </main>
          </Router>
        </ToastProvider>
      </div>
    </div>
  )
}

export default App