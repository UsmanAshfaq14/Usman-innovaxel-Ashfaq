const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  theater: { type: String, required: true },
  availableSeats: [{ type: String }], // e.g., ['A1', 'A2', 'A3']
  reservedSeats: [{ type: String }],  // Seats already booked
  lockedSeats: [
    {
      seat: { type: String },
      lockedAt: { type: Date, default: Date.now }, // Lock timestamp
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
