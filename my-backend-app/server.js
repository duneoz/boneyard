const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Path module to serve React build files

dotenv.config();

const app = express();

// Import Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const pickRoutes = require('./routes/picks');
const userStatsRoutes = require('./routes/userstats');
const myStatsRoutes = require('./routes/mystats');

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes); // Authentication Routes
app.use('/api/games', gameRoutes); // Game Routes
app.use('/api/picks', pickRoutes); // Picks Routes
app.use('/api/userStats', userStatsRoutes); // User Stats Routes
app.use('/api/mystats', myStatsRoutes); // My Stats Routes

// Serve React static files after API routes
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, './my-react-app/build'); // Adjust path to your React build folder
  app.use(express.static(buildPath));

  // Serve index.html for non-API routes (handles React's client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

