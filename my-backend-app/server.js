const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');  // Add path module to serve React build files

dotenv.config();

// Import Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const pickRoutes = require('./routes/picks');
const userStatsRoutes = require('./routes/userstats');
const myStatsRoutes = require('./routes/mystats');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);  // Authentication Routes
app.use('/api/games', gameRoutes); // Game Routes
app.use('/api/picks', pickRoutes); // Picks Routes
app.use('/api/userStats', userStatsRoutes); // User Stats Routes
app.use('/api/mystats', myStatsRoutes); // My Stats Routes

// Serve React static files after API routes
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Serve index.html for any non-API route (this handles React's routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
