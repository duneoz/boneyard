const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Ensure mongoose is required
const User = require('../models/User'); // Assuming User model is in the models folder
const MyStats = require('../models/MyStats'); // Assuming MyStats model is in the models folder

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Received request for userId: ${userId}`); // Debugging line

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const mystats = await MyStats.findOne({ userId }).lean();
        if (!mystats) {
            return res.status(404).json({ message: 'Stats not found for the user' });
        }

        res.json({
            rank: mystats.rank,
            score: mystats.score,
            conversionRate: mystats.conversionRate,
            pointsAvailable: mystats.pointsAvailable
        });
    } catch (error) {
        console.error('Error fetching my stats:', error);
        res.status(500).json({ error: 'Failed to fetch my stats' });
    }
});




module.exports = router;
