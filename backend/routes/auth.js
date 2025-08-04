const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const protect = require('../middleware/authMiddleware')

// ✅ Corrected typo here
const JWT_SECRET = process.env.JWT_SECRET

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
        return res.status(400).json({ error: 'Username is already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'Signup successful' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: 'Signup failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })

    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, email: user.email, username: user.username } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/auth/profile - Protected route to get user info
router.get('/profile', protect, (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    })
  } else {
    res.status(404).json({ error: 'User not found' })
  }
})

// PUT /api/auth/profile - Protected route to update user info
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    // Check for existing user with the same username (excluding the current user)
    const existingUsername = await User.findOne({ username, _id: { $ne: req.user.id } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Check for existing user with the same email (excluding the current user)
    const existingEmail = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router