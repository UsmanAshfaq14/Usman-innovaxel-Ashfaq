// routes/reservationRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Seat = require('../models/Seat');
const SeatReservation = require('../models/SeatReservation');
const Showtime = require('../models/Showtime');  // Assuming Showtime model is defined already
const { verifyToken } = require('../middlewares/verifyTokenMiddleware');
const router = express.Router();

const SEAT_LOCK_DURATION = 3 * 60 * 1000;  // 3 minutes in milliseconds

// Helper function to lock seats for a short period
async function lockSeatsForDuration(seats, showtimeId) {
  const lockedSeats = seats.map(seat => ({ seatNumber: seat, status: 'locked', lockTimestamp: new Date() }));
  await Seat.updateOne(
    { showtimeId },
    { $set: { 'seats.$[seat].status': 'locked', 'seats.$[seat].lockTimestamp': new Date() } },
    { arrayFilters: [{ 'seat.seatNumber': { $in: seats } }] }
  );
  return lockedSeats;
}

// Create a seat reservation (POST /reserve-seats)
router.post('/reserve-seats', verifyToken, async (req, res) => {
  const { showtimeId, seats } = req.body;
  console.log("Received data:", { showtimeId, seats });

  try {
    // Check if the showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    // Check if the seats are available for this showtime
    const seatData = await Seat.findOne({ showtimeId });
    if (!seatData) {
      return res.status(404).json({ error: 'Seat availability not found for this showtime' });
    }

    // Check if requested seats are available or locked
    const unavailableSeats = seatData.seats.filter(seat => 
      seats.includes(seat.seatNumber) && (seat.status === 'reserved' || (seat.status === 'locked' && new Date() - seat.lockTimestamp < SEAT_LOCK_DURATION))
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ error: 'One or more seats are already reserved or locked' });
    }

    // Lock seats temporarily
    await lockSeatsForDuration(seats, showtimeId);

    // Create a new reservation
    const newReservation = new SeatReservation({
      userId: req.userId,
      showtimeId,
      seats: seats.map(seat => ({ seatNumber: seat })),
    });

    await newReservation.save();

    // Update seat status to 'reserved'
    await Seat.updateOne(
      { showtimeId },
      { $set: { 'seats.$[seat].status': 'reserved', 'seats.$[seat].reservedBy': req.userId } },
      { arrayFilters: [{ 'seat.seatNumber': { $in: seats } }] }
    );

    return res.status(201).json({ message: 'Reservation successful', reservation: newReservation });
  } catch (err) {
    console.error('Error reserving seats:', err);
    return res.status(500).json({ error: 'Server error while reserving seats' });
  }
});

module.exports = router;
