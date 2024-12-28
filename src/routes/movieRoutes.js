const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// POST /movies - Add a new movie
router.post('/movies', async (req, res) => {
  const { title, genre, description, releaseDate, duration } = req.body;
  try {
    const newMovie = new Movie({ title, genre, description, releaseDate, duration });
    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while adding the movie' });
  }
});

// GET /movies - Get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching movies' });
  }
});

// PUT /movies/:id - Update a movie
router.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre, description, releaseDate, duration } = req.body;
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, genre, description, releaseDate, duration, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully', movie: updatedMovie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating the movie' });
  }
});

// DELETE /movies/:id - Delete a movie
router.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting the movie' });
  }
});

module.exports = router;
