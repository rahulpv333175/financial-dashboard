const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const path = require('path')

// Load .env from the correct folder
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const Expense = require('../models/Expense')
const User = require('../models/User')

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    // Clear old data (optional)
    await Expense.deleteMany({})
    await User.deleteMany({})

    // Create a fixed user ID to link all seeded expenses to
    const rahulId = new mongoose.Types.ObjectId();

    // Insert sample user
    const hashedPassword = await bcrypt.hash('password123', 10)
    await User.create({
      _id: rahulId, // ✅ Use the fixed ID
      username: 'Rahul',
      email: 'rahul@example.com',
      password: hashedPassword
    })

    // Insert sample expenses and link them to the new user
    await Expense.insertMany([
      { title: 'Food', amount: 500, category: 'Groceries', user: rahulId }, // ✅ Link expense to rahulId
      { title: 'Petrol', amount: 1200, category: 'Transport', user: rahulId }  // ✅ Link expense to rahulId
    ])

    console.log('🚀 Sample data inserted and linked to user "Rahul" ✅')
    process.exit()
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })