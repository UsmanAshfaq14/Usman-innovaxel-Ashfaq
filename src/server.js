const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Movie Reservation System API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
