const mongoose = require('mongoose');
const express = require('express');// Import the express package
const User = require('../models/User');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
app.use(express.json());
// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/movieReservation')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })

const createAdmin = async () => {
  try {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', 
      isAdmin: true,
    });

    await admin.save();
    console.log('Admin user created:', admin);
    process.exit();
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
