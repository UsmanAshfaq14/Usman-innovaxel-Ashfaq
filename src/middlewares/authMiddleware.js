const jwt = require('jsonwebtoken');
const config = require('../config/config');  // Make sure this points to your config file

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from header

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify token with the same secret key used for signing it
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;  // Attach decoded user info to request object
    next();  // Continue to the next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
