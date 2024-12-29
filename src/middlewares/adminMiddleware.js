const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Correct import
require('dotenv').config(); 
const adminMiddleware = (req, res, next) => {
    // Verify JWT (you should already have an authMiddleware for this)
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
  
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Token is not valid' });
      }
  
      // Attach user data to the request object (this will be used in your routes)
      req.user = decoded;
  
      // Check if the user is an admin
      if (!req.user || !req.user.isAdmin) {
        console.log(`Access denied for user ID: ${req.user?.id}. Admin privileges required.`);
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  
      next(); // User is admin, continue to the next route
    });
  };
  
  module.exports = adminMiddleware;
  