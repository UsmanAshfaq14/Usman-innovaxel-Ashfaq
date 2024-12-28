const mongoose = require('mongoose');

const seatReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  seats: [{ type: String, required: true }],  // e.g., ["A1", "B2"]
  createdAt: { type: Date, default: Date.now },
});

const SeatReservation = mongoose.model('SeatReservation', seatReservationSchema);

module.exports = SeatReservation;
