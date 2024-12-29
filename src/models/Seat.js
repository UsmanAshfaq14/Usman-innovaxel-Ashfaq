const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    number: { type: String, required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    isReserved: { type: Boolean, default: false }, // To track reservation status
});

module.exports = mongoose.model('Seat', seatSchema);
