const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Ensure mongoose is required
const User = require('../models/User'); // Assuming User model is in the models folder
const MyStats = require('../models/MyStats'); // Assuming MyStats model is in the models folder

router.get('/user/:userId/mystats', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Find user to ensure they exist
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch stats for the current user
        const mystats = await MyStats.findOne({ userId }).lean();
        if (!mystats) {
            return res.status(404).json({ message: 'Stats not found for the user' });
        }

        // Destructure and return the relevant fields
        const { rank, score, conversionRate, pointsAvailable } = mystats;

        res.json({
            Rank: rank,
            Score: score,
            ConversionRate: conversionRate,
            PointsAvailable: pointsAvailable,
        });
    } catch (error) {
        console.error('Error fetching my stats:', error);
        res.status(500).json({ error: 'Failed to fetch my stats' });
    }
});

module.exports = router;
