 Usman-innovaxel-Ashfaq
Movie Reservation System

A backend system to handle user authentication, movie and showtime management, seat reservations, and system reports.

 Features

- User Authentication: Sign up, login, and manage admin roles.
- Movie Management: Admin can manage movies (CRUD operations).
- Showtime Management: Admin can manage showtimes for each movie.
- Seat Reservation: Users can reserve seats for a specific showtime.
- Reports: Admin can view and generate reports on reservations, seat availability, and revenue.
- Reservation Cancellation: Users can view and cancel upcoming reservations.

 Prerequisites

- Node.js (v16 or above)
- MongoDB (Local or Atlas)
- Postman or any other API testing tool

 Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project folder:

   ```bash
   cd movie-reservation-system
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   
   Create a `.env` file in the root of your project and set the following variables:
   
   ```bash
   PORT=5000
   MONGO_URI=<Your-MongoDB-Connection-URL>
   JWT_SECRET=<Your-JWT-Secret>
   ```

   Replace `<Your-MongoDB-Connection-URL>` with your MongoDB connection string (for example, `mongodb://localhost:27017/movieReservation` for a local instance) and `<Your-JWT-Secret>` with a secret key for JWT authentication.

5. Run the server:

   ```bash
   npm start
   ```

   This will start the server on the port specified (default: 5000).

 API Endpoints

 User Routes:

- POST /api/users/signup - User registration
- POST /api/users/login - User login
- GET /api/users/profile - Get user profile (requires authentication)

 Movie Routes:

- GET /api/movies - Get a list of all movies
- POST /api/movies - Admin: Add a new movie
- GET /api/movies/:id - Get details of a specific movie
- PUT /api/movies/:id - Admin: Update movie details
- DELETE /api/movies/:id - Admin: Delete a movie

 Showtime Routes:

- GET /api/showtimes - Get a list of showtimes
- POST /api/showtimes - Admin: Add a new showtime
- GET /api/showtimes/:id - Get details of a specific showtime
- PUT /api/showtimes/:id - Admin: Update showtime details
- DELETE /api/showtimes/:id - Admin: Delete a showtime

 Seat Reservation Routes:

- POST /api/reserve-seats - Reserve seats for a specific showtime (locked and confirmed)
- GET /api/reservations - Get reservation details for a user (filtered by movie or showtime)
- DELETE /api/reservations/cancel - Cancel an upcoming reservation

 Admin Routes:

- GET /api/admin/reservations - Admin: Get reservation statistics for a movie or showtime
- GET /api/admin/revenue - Admin: Get total revenue report

 Testing

You can test the API using Postman or any similar tool. Here are some sample requests to test:

1. User Signup:
   - POST /api/users/signup
   - Body:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```

2. User Login:
   - POST /api/users/login
   - Body:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```

3. Reserve Seats:
   - POST /api/reserve-seats
   - Body:
     ```json
     {
       "showtimeId": "<showtime-id>",
       "seats": ["A1", "A2"]
     }
     ```

4. Cancel Reservation:
   - DELETE /api/reservations/cancel
   - Body:
     ```json
     {
       "reservationId": "<reservation-id>"
     }
     ```

 Scheduled Tasks

- Clear expired seat locks: The system automatically clears expired seat locks every minute. This is handled by a scheduled job that checks all showtimes and removes any locks older than 3 minutes.

 Notes

- This project is built using Express for the backend and MongoDB for the database.
- JWT authentication is used for securing routes that require admin access or user-specific data.
- Ensure your MongoDB instance is running, either locally or through MongoDB Atlas, to connect successfully.

 License

This project is open-source and available under the [MIT License](LICENSE).
```

 Key Points to Customize:
- Replace `<repository-url>` with your actual repository URL.
- Update `<Your-MongoDB-Connection-URL>` and `<Your-JWT-Secret>` in the `.env` section.
- Adjust the API examples and paths based on the actual setup and requirements.

This README provides a comprehensive guide for setting up and running your movie reservation system. It includes necessary details for installation, configuration, usage, and testing. Let me know if you need further adjustments!
