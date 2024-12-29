const express = require('express');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const router = express.Router();

// POST /showtimes - Add a new showtime
router.post('/showtimes', async (req, res) => {
  const { movieId, date, time, theater, seatingPlan } = req.body;

  try {
    // Validate movie existence
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Validate seatingPlan (it should include seats)
    if (!seatingPlan || !Array.isArray(seatingPlan)) {
      return res.status(400).json({ error: 'Seating plan is required and should be an array.' });
    }

    // Initialize availableSeats based on the seatingPlan
    const availableSeats = seatingPlan.map(seat => seat); // or process the seatingPlan if needed

    const newShowtime = new Showtime({
      movieId,
      date,
      time,
      theater,
      availableSeats,  // Initialize availableSeats
      reservedSeats: [],  // Empty reservedSeats initially
      lockedSeats: []     // Empty lockedSeats initially
    });

    await newShowtime.save();
    res.status(201).json({ message: 'Showtime added successfully', showtime: newShowtime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while adding the showtime' });
  }
});


// GET /showtimes - Get all showtimes
router.get('/showtimes', async (req, res) => {
  try {
    const showtimes = await Showtime.find().populate('movieId', 'title genre');
    res.json(showtimes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching showtimes' });
  }
});

// PUT /showtimes/:id - Update a showtime
router.put('/showtimes/:id', async (req, res) => {
  const { id } = req.params;
  const { movieId, date, time, theater } = req.body;

  try {
    // Validate movie existence (if movieId is being updated)
    if (movieId) {
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
    }

    const updatedShowtime = await Showtime.findByIdAndUpdate(
      id,
      { movieId, date, time, theater, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    res.json({ message: 'Showtime updated successfully', showtime: updatedShowtime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating the showtime' });
  }
});

// DELETE /showtimes/:id - Delete a showtime
router.delete('/showtimes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedShowtime = await Showtime.findByIdAndDelete(id);

    if (!deletedShowtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    res.json({ message: 'Showtime deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting the showtime' });
  }
});

module.exports = router;
