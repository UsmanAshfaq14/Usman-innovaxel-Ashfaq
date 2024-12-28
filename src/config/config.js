// In config.js
module.exports = {
  dbURL: 'mongodb://localhost:27017/movieReservation',
  JWT_SECRET: process.env.JWT_SECRET || 'mySecretKey12345!', // Make sure this matches in both places
  port: process.env.PORT || 5000
};
