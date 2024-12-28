const express = require('express');
const SeatReservation = require('../models/SeatReservation');
const Showtime = require('../models/Showtime');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// POST /reserve-seats - Reserve seats for a showtime
router.post('/reserve-seats', authMiddleware, async (req, res) => {
  const { showtimeId, seats } = req.body;
  const userId = req.user.id; // Retrieved from auth middleware

  try {
    // Check if the showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    // Validate seat availability
    const conflictingReservations = await SeatReservation.find({
      showtimeId,
      seats: { $in: seats }, // Check for any overlap in the requested seats
    });

    if (conflictingReservations.length > 0) {
      const reservedSeats = conflictingReservations
        .map((reservation) => reservation.seats)
        .flat();
      const unavailableSeats = seats.filter((seat) => reservedSeats.includes(seat));

      return res.status(400).json({
        error: 'Some seats are already reserved',
        unavailableSeats,
      });
    }

    // Create a new reservation
    const newReservation = new SeatReservation({ userId, showtimeId, seats });
    await newReservation.save();

    res.status(201).json({
      message: 'Seats reserved successfully',
      reservation: newReservation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while reserving seats' });
  }
});

// GET /reservations - Get all reservations for the logged-in user
router.get('/reservations', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const reservations = await SeatReservation.find({ userId }).populate('showtimeId', 'date time theater');
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching reservations' });
  }
});

module.exports = router;
