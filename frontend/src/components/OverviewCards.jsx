// frontend/src/components/OverviewCards.jsx
const OverviewCards = ({ expenses }) => {
  // Calculate dynamic values based on the expenses prop
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0)

  const groupedByCategory = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {})

  const totalCategories = Object.keys(groupedByCategory).length

  const topCategory = Object.entries(groupedByCategory)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    
  const stats = [
    { title: "Total Expenses", value: `₹${totalSpent}`, bg: "bg-green-100", text: "text-green-800" },
    { title: "Categories", value: totalCategories, bg: "bg-blue-100", text: "text-blue-800" },
    { title: "Top Category", value: topCategory, bg: "bg-yellow-100", text: "text-yellow-800" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-lg shadow-md ${stat.bg} dark:bg-gray-800 transition-all`}
        >
          <h3 className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">{stat.title}</h3>
          <p className={`text-2xl font-bold ${stat.text} dark:text-white`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

export default OverviewCards