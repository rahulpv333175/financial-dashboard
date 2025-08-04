const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

// Load .env from backend folder explicitly
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

// Import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenses')
const budgetRoutes = require('./routes/budgetRoutes')
const savingGoalRoutes = require('./routes/savingGoalRoutes')
const reminderRoutes = require('./routes/reminderRoutes') // ✅ Import new reminder routes

// Import authentication middleware
const protect = require('./middleware/authMiddleware')

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
// Public routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Protected routes - apply 'protect' middleware here
app.use('/api/expenses', protect, expenseRoutes)
app.use('/api/budgets', protect, budgetRoutes)
app.use('/api/saving-goals', protect, savingGoalRoutes)
app.use('/api/reminders', protect, reminderRoutes) // ✅ Apply middleware to new reminder routes

console.log('MONGO_URI from .env:', process.env.MONGO_URI)
console.log('JWT_SECRET from .env is loaded.')

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ DB Connection Failed:', err))

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))