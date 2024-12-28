const express = require('express');// Import the express package
const mongoose = require('mongoose');// Import the mongoose package
const cors = require('cors');// Import the cors package
const dotenv = require('dotenv');// Import the dotenv package
const authRoutes = require('./routes/authRoutes');// Import the auth routes
const movieRoutes = require('./routes/movieRoutes'); // Import the movie routes
const reservationRoutes = require('./routes/reservationRoutes'); // Import the reservation routes
const userRoutes = require('./routes/userRoutes');// Import the user routes
const profileRoutes = require('./routes/profileRoutes'); // Assuming you create a separate profile routes file
const showtimeRoutes = require('./routes/showtimeRoutes');// Import the showtime routes
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const config = require('./config/config'); // Configuration for DB and JWT secret
const bodyParser = require('body-parser'); // Import body-parser
dotenv.config();// Load environment variables from .env file
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api/users', authRoutes);// Use auth routes
app.use('/api', movieRoutes); // Use movie routes
app.use('/api/reservations', reservationRoutes);// Use reservation routes
app.use('/api', userRoutes);// Use user routes
app.use('/api', profileRoutes);  // Profile routes
app.use('/api', movieRoutes);// Use movie routes
app.use('/api', showtimeRoutes);// Use showtime routes
app.use('/api', reservationRoutes);// Use reservation routes
app.use('/api', adminRoutes);// Use admin routes


// Start the server
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
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
// Start the server
