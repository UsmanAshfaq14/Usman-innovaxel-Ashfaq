const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', // Reference to the Movie model
    required: true,
  },
  seatNumbers: {
    type: [String],
    required: true,
  },
  showtime: {
    type: Date,
    required: true,
  },
});

const Reservation = mongoose.model('Reservation', ReservationSchema);
module.exports = Reservation;
