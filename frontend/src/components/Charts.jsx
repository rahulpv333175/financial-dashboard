// frontend/src/components/Charts.jsx
import { Bar, Pie } from "react-chartjs-2"
import { Chart, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js"

Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend)

const Charts = ({ expenses }) => {
  const categoryTotals = {}

  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
  })

  const labels = Object.keys(categoryTotals)
  const dataValues = Object.values(categoryTotals)

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expense by Category",
        data: dataValues,
        backgroundColor: [
          "#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa"
        ],
        borderRadius: 6,
        barThickness: 40
      },
    ],
  }

  const pieData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#f87171", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa"
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Bar Chart */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          📊 Bar Chart – Expenses by Category
        </h2>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>

      {/* Pie Chart */}
      <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          🥧 Pie Chart – Expense Distribution
        </h2>
        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>
    </div>
  )
}

export default Charts
