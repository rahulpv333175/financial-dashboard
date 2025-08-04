const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware') // Import the middleware

// GET /api/users/profile - Protected route to get user info
router.get('/profile', protect, (req, res) => {
  if (req.user) {
    // The `req.user` object is attached by the `protect` middleware
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    })
  } else {
    res.status(404).json({ error: 'User not found' })
  }
})

module.exports = router