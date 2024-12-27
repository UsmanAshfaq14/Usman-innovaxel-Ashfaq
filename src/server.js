// src/server.js
const express = require('express');
const cors = require('cors'); // Import cors package
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import auth routes

const app = express();

// Enable CORS for all routes
app.use(cors());  // This line allows cross-origin requests

app.use(express.json());  // To parse JSON requests

// Use authentication routes
app.use('/api/auth', authRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/movieReservation')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

