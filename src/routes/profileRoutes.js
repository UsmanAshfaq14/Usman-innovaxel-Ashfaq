const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware'); // Authentication middleware
const router = express.Router();

// GET /profile - Retrieve the current user's profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token
    const user = await User.findById(userId).select('-password -salt'); // Exclude password and salt

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /profile - Update the current user's profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { email, name } = req.body; // Allow users to update their email and name
  try {
    const userId = req.user.id; // Get user ID from the token
    const user = await User.findByIdAndUpdate(userId, { email, name }, { new: true }).select('-password -salt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
