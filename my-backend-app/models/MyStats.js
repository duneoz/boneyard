const mongoose = require('mongoose');

const myStatsSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        rank: { type: Number, required: true },
        score: { type: Number, required: true },
        conversionRate: { type: Number, required: true },
        pointsAvailable: { type: Number, required: true },
    },
    { collection: 'userStats' } // Explicit collection name
);

module.exports = mongoose.model('MyStats', myStatsSchema);


