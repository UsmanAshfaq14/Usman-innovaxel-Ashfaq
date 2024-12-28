const SeatReservation = require('../models/SeatReservation');

const validateSeatAvailability = async (showtimeId, seats) => {
  const conflictingReservations = await SeatReservation.find({
    showtimeId,
    seats: { $in: seats },
  });

  if (conflictingReservations.length > 0) {
    const reservedSeats = conflictingReservations.map((res) => res.seats).flat();
    return seats.filter((seat) => reservedSeats.includes(seat));
  }

  return [];
};

module.exports = validateSeatAvailability;
