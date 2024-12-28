const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  director: { type: String },
  releaseDate: { type: Date },
  duration: { type: Number }, // Duration in minutes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Movie', movieSchema);
