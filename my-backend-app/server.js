const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Path module to serve React build files

console.log('Second Check Current NODE_ENV:', process.env.NODE_ENV);

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

// Add CORS middleware (ensure this is above the API routes)
app.use(cors({
  origin: ['https://bowl-bash-148f8ac7cdb4.herokuapp.com', 'https://bowl-bash.herokuapp.com'],  // Allow both domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Methods allowed
  credentials: true, // Allow cookies to be sent with requests
}));

// Handle preflight OPTIONS requests for CORS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', ['https://bowl-bash-148f8ac7cdb4.herokuapp.com', 'https://bowl-bash.herokuapp.com']);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

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
  const buildPath = path.resolve(__dirname, '../my-react-app/build'); // Use path.resolve for consistent cross-platform paths
  console.log('Second Check Current NODE_ENV:', process.env.NODE_ENV);

  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

