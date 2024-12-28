const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config'); // Correct import
require('dotenv').config();  



const authRouter = express.Router();

// User Registration Endpoint
authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Registering user...');
    console.log('Email:', email);
    console.log('Password:', password);

    // Hash the password using Argon2 (argon2 handles salting internally)
    const hashedPassword = await argon2.hash(password);

    console.log('Hashed Password:', hashedPassword);

    // Save the user with the hashed password
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// User Login Endpoint
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Logging in...');
    console.log('Email:', email);
    console.log('Entered Password:', password);

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Found user:', user.email);
    console.log('Stored password hash:', user.password);

    // Verify the entered password with the stored hashed password using Argon2
    const isMatch = await argon2.verify(user.password, password);

    if (isMatch) {
      console.log('Password match successful');
      
      // Define the payload for the JWT (you can include whatever data you want)
      const payload = {
        id: user._id,
        email: user.email
      };

      // Sign the JWT token
      const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });

      // Send the token in the response
      return res.status(200).json({ message: 'Login successful', token });
    } else {
      console.log('Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = authRouter;
