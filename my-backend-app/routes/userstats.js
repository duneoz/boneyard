const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');


router.get('/leaderboard', async (req, res) => {
    try {
        console.log('Fetching leaderboard...');
        const leaderboard = await UserStats.find().sort({ rank: 1 }).lean();
        console.log('Leaderboard data:', leaderboard); // Debug log
        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;