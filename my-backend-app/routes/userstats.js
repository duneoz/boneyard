// my-backend-app/routes/userStats.js
const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');

router.get('/leaderboard', async (req, res) => {
  try {
    console.log('Fetching leaderboard...');
    
    // Fetch all user stats sorted by overall rank
    const leaderboard = await UserStats.find().sort({ rank: 1 }).lean();

    // Include userId for easier matching with league members
    const leaderboardWithUserId = leaderboard.map(entry => ({
      ...entry,
      userId: entry.userId.toString(), // matches Users _id
    }));

    console.log('Leaderboard data:', leaderboardWithUserId); // Debug log
    res.json(leaderboardWithUserId);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
