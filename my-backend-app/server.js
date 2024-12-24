const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Import Routes (add these)
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const pickRoutes = require('./routes/picks');
const userStatsRoutes = require('./routes/userstats'); // Adjust path as needed


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes (add these)
app.use('/api/auth', authRoutes);  // Authentication Routes
app.use('/api/games', gameRoutes); // Game Routes
app.use('/api/picks', pickRoutes); // Picks Routes
app.use('/api/userStats', userStatsRoutes); //user Stats Routes

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
