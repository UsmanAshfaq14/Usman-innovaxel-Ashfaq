const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// POST /api/reservations
router.post('/', async (req, res) => {
  try {
    const { user, movie, showtime, seats } = req.body;
    if (!user || !movie || !showtime || !seats) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newReservation = new Reservation({ user, movie, showtime, seats });
    await newReservation.save();
    res.json({ message: 'Reservation created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error creating reservation' });
  }
});

// GET /api/reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reservations' });
  }
});

// GET /api/reservations/:id
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reservation' });
  }
});

module.exports = router;
