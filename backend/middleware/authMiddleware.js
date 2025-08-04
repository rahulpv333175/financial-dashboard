const jwt = require('jsonwebtoken')
const User = require('../models/User') // Assuming you might want to fetch user data based on ID later

const JWT_SECRET = process.env.JWT_SECRET

const protect = async (req, res, next) => {
  let token

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET)

      // Attach user to the request (without password)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      next() // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification failed:', error.message)
      return res.status(401).json({ error: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' })
  }
}

module.exports = protect