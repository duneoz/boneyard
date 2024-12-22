const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming User model is in the models folder
const Game = require('../models/Game'); // Assuming Game model is in the models folder
const Pick = require('../models/Pick'); // Assuming Pick model is in the models folder
const mongoose = require('mongoose'); // Import mongoose


// Submit picks for a user
router.post('/submit', async (req, res) => {
  const { userId, picks } = req.body; // picks is an array of gameId, selectedWinner, and confidence

  console.log('Received picks in backend:', picks);

  // Validate picks
  if (!Array.isArray(picks) || picks.length === 0) {
    return res.status(400).json({ message: 'No picks submitted' });
  }

  // Validate each pick structure
  for (const pick of picks) {
    if (!pick.gameId || !pick.selectedWinner || pick.confidence === undefined) {
      return res.status(400).json({ message: 'Each pick must contain gameId, selectedWinner, and confidence' });
    }
  }

  

  try {

    // Extract the userId from the first pick (or any pick)
  const userId = picks[0]?.userId;
  console.log('User ID from picks:', userId);  // Check if userId is being extracted correctly
  
    // Ensure no duplicate confidence levels in the request
    const confidenceValues = picks.map((pick) => pick.confidence);
    if (new Set(confidenceValues).size !== confidenceValues.length) {
      return res.status(400).json({ message: 'Confidence levels must be unique' });
    }

    // Ensure the user has not already submitted picks
    console.log('Received userId:', userId);
    const user = await User.findById(userId);
    console.log('User found:', user);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.picksSubmitted) {
      return res.status(400).json({ message: 'Picks already submitted' });
    }

    // Create picks for each game
    const pickPromises = picks.map(async (pick) => {
      const game = await Game.findById(pick.gameId);
      if (!game) {
        return res.status(404).json({ message: `Game with ID ${pick.gameId} not found` });
      }
      const isCorrect = game.winner === pick.selectedWinner;
      const newPick = new Pick({
        userId,
        gameId: pick.gameId,
        selectedWinner: pick.selectedWinner,
        confidence: pick.confidence,
        isCorrect,
      });
      await newPick.save();
    });

    await Promise.all(pickPromises);

    // Update picksSubmitted for the user
    user.picksSubmitted = true;
    await user.save();

    res.status(201).json({ message: 'Picks submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all picks for a user with confidence levels
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const picks = await Pick.find({ userId: req.params.userId })
//       .populate('gameId') // Populate game details if needed
//       .select('gameId selectedWinner confidence isCorrect'); // Return only relevant fields
//     res.status(200).json(picks);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Get user picks and stats with detailed game information
router.get('/user/:userId/picks-and-stats', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    const stats = await Pick.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Use 'new' keyword for ObjectId
      {
        $lookup: {
          from: 'games', // Join with the games collection
          localField: 'gameId',
          foreignField: '_id',
          as: 'gameDetails',
        },
      },
      { $unwind: '$gameDetails' }, // Flatten the joined game details
      {
        $project: {
          gameName: '$gameDetails.name',
          team1: '$gameDetails.team1',
          team2: '$gameDetails.team2',
          date: '$gameDetails.date',
          userPick: '$selectedWinner',
          pointsWagered: '$confidence',
          pointsEarned: {
            $cond: { if: { $eq: ['$isCorrect', true] }, then: '$confidence', else: 0 },
          },
        },
      },
    ]);

    if (!stats.length) {
      return res.status(404).json({ message: 'No picks found for this user' });
    }

    const totalScore = stats.reduce((sum, stat) => sum + stat.pointsEarned, 0);

    res.status(200).json({
      rank: 'Not Available', // Placeholder
      score: totalScore,
      picks: stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
