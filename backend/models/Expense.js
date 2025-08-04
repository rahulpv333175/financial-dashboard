const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: { // ✅ Add a reference to the User model
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

module.exports = mongoose.model('Expense', expenseSchema)