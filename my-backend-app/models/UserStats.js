const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        rank: { type: Number, required: true },
        score: { type: Number, required: true },
        pointsWagered: { type: Number, required: true },
        conversionRate: { type: Number, required: true },
        pointsAvailable: { type: Number, required: true },
    },
    { collection: 'userStats' } // Explicit collection name
);

module.exports = mongoose.model('UserStats', userStatsSchema);
