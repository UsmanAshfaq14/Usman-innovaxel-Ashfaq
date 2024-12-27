const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const movieRoutes = require('./routes/movieRoutes'); // Import the movie routes
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use movie routes
app.use('/api', movieRoutes); // Add '/api' as base route for movie routes

const PORT = process.env.PORT || 5000;

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

