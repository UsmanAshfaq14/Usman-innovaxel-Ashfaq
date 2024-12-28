const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// GET /profile - Protected
router.get('/profile', authMiddleware, async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id).select('-password'); // Exclude the password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /profile - Protected
router.put('/profile', authMiddleware, async (req, res) => {
  const { id } = req.user;
  const { email, name } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.email = email || user.email;
    user.name = name || user.name;
    await user.save();

    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
