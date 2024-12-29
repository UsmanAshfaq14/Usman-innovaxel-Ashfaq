const mongoose = require('mongoose');

const seatReservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seats: [{
    seatNumber: { type: String, required: true },
    status: { type: String, enum: ['reserved', 'available'], default: 'reserved' },
  }],
  reservationDate: { type: Date, default: Date.now },
});

const SeatReservation = mongoose.model('SeatReservation', seatReservationSchema);
module.exports = SeatReservation;
