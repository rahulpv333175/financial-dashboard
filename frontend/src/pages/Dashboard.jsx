import React, { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import ExpenseForm from "../components/ExpenseForm"
import BudgetBreakdown from "../components/BudgetBreakdown"
import ExpenseTable from "../components/ExpenseTable"
import BudgetManager from "../components/BudgetManager"
import OverviewCards from "../components/OverviewCards"
import SavingGoalTracker from "../components/SavingGoalTracker"
import ReminderAlerts from "../components/ReminderAlerts"
import PageHeader from "../components/PageHeader"; // ✅ Import new component
import { Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const [expenses, setExpenses] = useState([])
  const [editingExpense, setEditingExpense] = useState(null)

  const budgetLimit = 5000
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/expenses")
        setExpenses(response.data)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    }

    fetchExpenses()
  }, [])

  const handleUpdate = (updatedExpense) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === updatedExpense._id ? updatedExpense : exp))
    )
    setEditingExpense(null)
  }

  const handleAdd = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense])
  }

  const groupedByCategory = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(groupedByCategory),
    datasets: [
      {
        label: "Expenses",
        data: Object.values(groupedByCategory),
        backgroundColor: ["#f87171", "#60a5fa", "#fbbf24", "#34d399", "#a78bfa"]
      }
    ]
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 10
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280",
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6b7280",
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6b7280",
          font: {
            size: 12
          }
        }
      }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      <PageHeader title="📊 Overview" /> {/* ✅ Use the new component */}

      <motion.div
        className={`text-sm mb-2 p-2 rounded-md w-full max-w-md ${
          totalSpent > budgetLimit
            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
        }`}
        variants={sectionVariants}
      >
        {totalSpent > budgetLimit ? (
          <>⚠ Budget Limit Exceeded: ₹{totalSpent} spent of ₹{budgetLimit}</>
        ) : (
          <>✅ ₹{totalSpent} spent of ₹{budgetLimit} budget</>
        )}
      </motion.div>

      <motion.div variants={sectionVariants}>
        <OverviewCards expenses={expenses} />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={sectionVariants}
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-[26rem]">
          <h2 className="text-lg font-semibold mb-4">Bar Chart</h2>
          <div className="h-[20rem]">
            <Bar data={chartData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-[26rem]">
          <h2 className="text-lg font-semibold mb-4">Pie Chart</h2>
          <div className="h-[20rem]">
            <Pie data={chartData} options={pieOptions} />
          </div>
        </div>
      </motion.div>

      <motion.div variants={sectionVariants}>
        <ExpenseTable expenses={expenses} setExpenses={setExpenses} onEdit={setEditingExpense} />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <ExpenseForm
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
        />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <BudgetManager expenses={expenses} />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <BudgetBreakdown expenses={expenses} />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <SavingGoalTracker />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <ReminderAlerts />
      </motion.div>
    </motion.div>
  )
}

export default Dashboard