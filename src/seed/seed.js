const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import the models
const User = require('../models/User');
const Movie = require('../models/Movie');
const Reservation = require('../models/Reservation');

// Load environment variables from .env file
dotenv.config();

// Dummy user data
const users = [
  { name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' }
];

// Dummy movie data
const movies = [
    {
      title: 'Movie 1',
      genre: 'Action',
      duration: 120,
      releaseDate: new Date('2024-01-01'), // Added releaseDate
      description: 'An action-packed adventure movie.' // Added description
    },
    {
      title: 'Movie 2',
      genre: 'Comedy',
      duration: 90,
      releaseDate: new Date('2024-06-01'), // Added releaseDate
      description: 'A fun and lighthearted comedy.' // Added description
    },
    {
      title: 'Movie 3',
      genre: 'Drama',
      duration: 150,
      releaseDate: new Date('2024-03-15'), // Added releaseDate
      description: 'A gripping drama about life and choices.' // Added description
    }
  ];

// Dummy reservation data (note: you need to use valid user IDs and movie IDs)
const reservations = [
  {
    user: null,  // These will be populated with the actual user IDs later
    movie: null,  // These will be populated with the actual movie IDs later
    showtime: new Date('2024-12-28T19:00:00Z')
  },
  {
    user: null,  // These will be populated with the actual user IDs later
    movie: null,  // These will be populated with the actual movie IDs later
    showtime: new Date('2024-12-29T20:00:00Z')
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect( 'mongodb://127.0.0.1:27017/movieReservation');
    console.log('MongoDB connected for seeding');

    // Clear existing collections
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Reservation.deleteMany({});

    // Insert dummy users
    const insertedUsers = await User.insertMany(users);
    console.log(`${insertedUsers.length} users inserted`);

    // Insert dummy movies
    const insertedMovies = await Movie.insertMany(movies);
    console.log(`${insertedMovies.length} movies inserted`);

    // Update reservation data with the inserted user and movie IDs
    reservations[0].user = insertedUsers[0]._id;
    reservations[0].movie = insertedMovies[0]._id;

    reservations[1].user = insertedUsers[1]._id;
    reservations[1].movie = insertedMovies[1]._id;

    // Insert dummy reservations
    const insertedReservations = await Reservation.insertMany(reservations);
    console.log(`${insertedReservations.length} reservations inserted`);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

seedDatabase();
