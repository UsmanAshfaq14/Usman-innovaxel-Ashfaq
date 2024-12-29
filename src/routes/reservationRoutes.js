const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const SeatReservation = require('../models/SeatReservation'); // Import the SeatReservation model
const Showtime = require('../models/Showtime');

// View upcoming reservations for a user
router.get('/reservations', async (req, res) => {
  try {
    const { userId } = req.query; // Get the userId from query params (or from JWT)

    // Fetch future reservations for the user
    const reservations = await SeatReservation.find({ userId })
      .populate('showtimeId') // Populate showtime details
      .where('showtimeId.date').gt(new Date()) // Only future showtimes
      .exec();

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ error: 'No upcoming reservations found' });
    }

    // Return the reservation details along with showtime information
    return res.status(200).json({ message: 'Upcoming reservations fetched successfully', reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching reservations' });
  }
});

// Cancel an upcoming reservation
router.delete('/reservations/:reservationId', async (req, res) => {
  try {
    const { reservationId } = req.params;

    // Fetch the reservation to ensure it exists and get associated showtime
    const reservation = await SeatReservation.findById(reservationId).populate('showtimeId');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Check if the showtime is in the future
    const showtime = reservation.showtimeId;
    if (new Date(showtime.date) < new Date()) {
      return res.status(400).json({ error: 'Cannot cancel past reservations' });
    }

    // Remove seats from reservedSeats and make them available
    const canceledSeats = reservation.seats.map(seat => seat.seatNumber);

    // Update the showtime: remove seats from reservedSeats and add to availableSeats
    showtime.reservedSeats = showtime.reservedSeats.filter(seat => !canceledSeats.includes(seat));
    showtime.availableSeats.push(...canceledSeats);

    // Remove the reservation from the SeatReservation collection
    await SeatReservation.findByIdAndDelete(reservationId);

    // Save the updated showtime
    await showtime.save();

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while canceling reservation' });
  }
});

// Reserve Seats Endpoint (unchanged, but included for reference)
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

module.exports = router;
