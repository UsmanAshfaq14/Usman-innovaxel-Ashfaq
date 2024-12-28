const mongoose = require('mongoose');

const seatReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seats: { type: [String], required: true }, // Example: ["A1", "A2"]
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SeatReservation', seatReservationSchema);
