const express = require('express');
const Movie = require('../models/Movie');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

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

module.exports = router;
