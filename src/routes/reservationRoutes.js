const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Showtime = require('../models/Showtime');

// Reserve Seats Endpoint
router.post('/reserve-seats', async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    // Fetch the showtime document
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

    console.log('Showtime available seats:', showtime.availableSeats);
    console.log('Showtime locked seats:', showtime.lockedSeats);
    console.log('Showtime reserved seats:', showtime.reservedSeats);

    // Check seat availability
    const unavailableSeats = seats.filter(
      (seat) =>
        !showtime.availableSeats.includes(seat) || // Seat not in available seats
        showtime.lockedSeats.some((lock) => lock.seat === seat) || // Seat locked
        showtime.reservedSeats.includes(seat) // Seat already reserved
    );

    console.log('Unavailable seats:', unavailableSeats);

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ error: `Seats unavailable: ${unavailableSeats.join(', ')}` });
    }

    // Lock the seats
    seats.forEach((seat) => {
      showtime.lockedSeats.push({ seat, lockedAt: new Date() });
    });

    await showtime.save();

    // Confirm reservation after lock duration
    setTimeout(async () => {
      const doubleCheckUnavailable = seats.filter(
        (seat) =>
          !showtime.availableSeats.includes(seat) ||
          showtime.reservedSeats.includes(seat)
      );

      console.log('Double check unavailable seats:', doubleCheckUnavailable);

      if (doubleCheckUnavailable.length === 0) {
        // Reserve seats
        seats.forEach((seat) => {
          showtime.availableSeats = showtime.availableSeats.filter(
            (s) => s !== seat
          );
          showtime.reservedSeats.push(seat);
        });

        // Remove locks
        showtime.lockedSeats = showtime.lockedSeats.filter(
          (lock) => !seats.includes(lock.seat)
        );

        await showtime.save();
      }
    }, 5000); // Lock duration: 5 seconds

    res.status(200).json({ message: 'Seats reserved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while reserving seats' });
  }
});


// Optional: Clear expired locks with a scheduled job
// Clear expired locks (optional, e.g., via a scheduled job)
setInterval(async () => {
  try {
    const expirationTime = 3 * 60 * 1000; // 3 minutes
    const now = new Date();

    // Fetch all showtimes and clear expired locks
    const showtimes = await Showtime.find({});
    for (const showtime of showtimes) {
      // Remove expired locks
      showtime.lockedSeats = showtime.lockedSeats.filter(
        (lock) => now - lock.lockedAt < expirationTime
      );
      await showtime.save();
    }

    console.log('Expired locks cleared successfully');
  } catch (error) {
    console.error('Error clearing expired locks:', error);
  }
}, 60000); // Run every 1 minute

module.exports = router;
