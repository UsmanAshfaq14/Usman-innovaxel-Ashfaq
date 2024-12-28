const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Correct import
require('dotenv').config(); 
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Attach the user to the request object
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
