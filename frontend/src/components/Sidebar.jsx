import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart2, User, Moon, Sun, LogOut } from "lucide-react";

const Sidebar = ({ darkMode, setDarkMode, handleLogout, isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();

  const navLinks = [
    { path: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/expenses", icon: <BarChart2 size={20} />, label: "Expenses" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 w-64 h-screen shadow-lg flex flex-col transition-transform duration-300 ease-in-out z-40 ${
        darkMode ? 'bg-gray-950 text-white' : 'bg-pink-200 text-black'
      }`} // ✅ Removed the 'hidden md:flex' class
    >
      {/* 🔆 Dark/Light Mode Toggle */}
      <div className="absolute top-4 right-4 z-50 md:static md:flex md:justify-end md:p-4">
        <div className="relative group inline-block">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="absolute top-full mt-1 right-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Switch to {darkMode ? "light" : "dark"} mode
          </div>
        </div>
      </div>

      {/* 🧾 Title */}
      <div className="p-6 pt-16 text-2xl font-bold text-center border-b border-gray-300 dark:border-gray-700">
        💰 FinDash
      </div>

      {/* 🚀 Nav Items */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              location.pathname === link.path
                ? "bg-gray-700 dark:bg-gray-700 font-semibold"
                : ""
            }`}
            onClick={toggleSidebar}
          >
            {link.icon}
            <span className="ml-3">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 rounded text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 transition"
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;