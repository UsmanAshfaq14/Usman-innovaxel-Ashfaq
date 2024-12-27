const Reservation = require('../models/reservation'); // Import the Reservation model

const createReservation = async (req, res) => {
    try {
      const { user, movie, seatNumbers, showtime } = req.body;
  
      // Validate required fields
      if (!user || !movie || !seatNumbers || !showtime) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const newReservation = new Reservation({ user, movie, seatNumbers, showtime });
      await newReservation.save();
      res.status(201).json(newReservation);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create reservation', error: err.message });
    }
  };
  

// Get all reservations (Define the missing function here)
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reservations', error: err.message });
  }
};

// Get reservations for a specific user
const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await Reservation.find({ userId });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user reservations', error: err.message });
  }
};

module.exports = { createReservation, getReservations, getUserReservations };
