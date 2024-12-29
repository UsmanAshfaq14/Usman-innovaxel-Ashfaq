const express = require('express');
const Movie = require('../models/Movie');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const SeatReservation = require('../models/SeatReservation');
const router = express.Router();
const mongoose = require('mongoose');// Import the mongoose package

// GET /admin/movies - Get all movies
router.get('/admin/movies', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /admin/movies - Add a new movie
router.post('/admin/movies', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, genre, description, director, releaseDate, duration } = req.body;

  try {
    const movie = new Movie({ title, genre, description, director, releaseDate, duration });
    await movie.save();
    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /admin/movies/:id - Update a movie
router.put('/admin/movies/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, genre, description, director, releaseDate, duration } = req.body;

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, genre, description, director, releaseDate, duration },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie updated successfully', movie });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /admin/movies/:id - Delete a movie
router.delete('/admin/movies/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin - Get reservation statistics for a movie or showtime
router.get('/admin/reservations', async (req, res) => {
  const { movieId, showtimeId, userId } = req.query;

  // Validate ObjectId format for movieId, showtimeId, and userId
  if (movieId && !mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: 'Invalid movieId format' });
  }
  if (showtimeId && !mongoose.Types.ObjectId.isValid(showtimeId)) {
    return res.status(400).json({ error: 'Invalid showtimeId format' });
  }
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    // Build the query based on optional filters
    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (showtimeId) filter.showtimeId = showtimeId;
    if (userId) filter.userId = userId;

    // Fetch the reservation data based on the filter
    const reservations = await SeatReservation.find(filter);

    // Group reservations by movie or showtime if needed
    const reservationCount = reservations.length;
    
    // Fetch additional information (optional)
    const movie = movieId ? await Movie.findById(movieId) : null;
    const showtime = showtimeId ? await Showtime.findById(showtimeId) : null;

    let availableSeats = 0;
    let revenue = 0;
    if (showtime) {
      const totalSeats = showtime.availableSeats.length;
      const reservedSeats = showtime.reservedSeats.length;
      availableSeats = totalSeats - reservedSeats;
      
      const ticketPrice = movie ? movie.ticketPrice : 10; // Default price if not set
      revenue = reservedSeats * ticketPrice;
    }

    return res.status(200).json({
      message: 'Reservation report retrieved successfully',
      reservationCount,
      availableSeats,
      revenue,
      movie: movie ? { title: movie.title, genre: movie.genre } : null,
      reservations: reservations
    });
  } catch (err) {
    console.error('Error fetching reservation data:', err);
    return res.status(500).json({ error: 'Server error while fetching reservation data' });
  }
});

module.exports = router;
