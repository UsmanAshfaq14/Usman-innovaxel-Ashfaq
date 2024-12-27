const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// Create a new movie
router.post('/movies', async (req, res) => {
  const { title, description, releaseDate, showtimes } = req.body;

  try {
    const movie = new Movie({ title, description, releaseDate, showtimes });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
