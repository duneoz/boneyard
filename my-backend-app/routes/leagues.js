// my-backend-app/routes/leagues.js
const express = require('express');
const router = express.Router();
const League = require('../models/League');
const User = require('../models/User');
const UserStats = require('../models/UserStats');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded; // decoded contains { userId: ... }
    next();
  });
}

// Generate join code
function generateJoinCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/leagues/create
// POST /api/leagues/create
const MAX_LEAGUES_PER_USER = 10;

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    if (!name || !name.trim()) return res.status(400).json({ message: 'League name is required' });

    // Check how many leagues this user has already created
    const createdCount = await League.countDocuments({ creatorId: userId });
    if (createdCount >= MAX_LEAGUES_PER_USER) {
      return res.status(403).json({ message: `You can only create up to ${MAX_LEAGUES_PER_USER} leagues.` });
    }

    const joinCode = generateJoinCode();

    const newLeague = await League.create({
      name,
      description,
      joinCode,
      creatorId: userId,
      members: [userId],
    });

    // Add league to user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { leaguesJoined: newLeague._id },
    });

    const populatedLeague = await League.findById(newLeague._id).populate('members', 'username');
    res.json(populatedLeague);
  } catch (error) {
    console.error('Error creating league:', error);
    res.status(500).json({ message: 'Error creating league' });
  }
});


// POST /api/leagues/join
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.userId;

    if (!code || !code.trim()) return res.status(400).json({ message: 'Join code is required' });

    const league = await League.findOne({ joinCode: code });
    if (!league) return res.status(404).json({ message: 'Invalid join code' });

    // Check if user is already in the league
    if (league.members.some((m) => m.toString() === userId)) {
      return res.status(400).json({ message: 'You are already a member of this league' });
    }

    // Add user to league members
    league.members.push(userId);
    await league.save();

    // Add league to user's leaguesJoined
    await User.findByIdAndUpdate(userId, {
      $addToSet: { leaguesJoined: league._id },
    });

    const populatedLeague = await League.findById(league._id).populate('members', 'username');
    res.json(populatedLeague);
  } catch (error) {
    console.error('Error joining league:', error);
    res.status(500).json({ message: 'Error joining league' });
  }
});

// GET /api/leagues/my-leagues
router.get('/my-leagues', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate({
      path: 'leaguesJoined',
      select: 'name description members joinCode createdAt creatorId',
      populate: { path: 'members', select: 'username' },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const leagues = user.leaguesJoined || [];

    // Collect all member IDs across all leagues
    const allMemberIds = [
      ...new Set(leagues.flatMap((league) => league.members.map((m) => m._id.toString())))
    ];

    // Fetch all UserStats for these members
    const allStats = await UserStats.find({ userId: { $in: allMemberIds } }).lean();

    const enrichedLeagues = leagues.map((league) => {
      const membersWithStats = league.members.map((member) => {
        const stats = allStats.find((s) => s.userId.toString() === member._id.toString());
        return {
          _id: member._id.toString(),
          username: member.username,
          userStatsId: stats?._id.toString(),
          userStats: stats || null,
        };
      });

      return {
        ...league.toObject(),
        members: membersWithStats,
      };
    });

    res.json(enrichedLeagues);
  } catch (error) {
    console.error('Error fetching user leagues:', error);
    res.status(500).json({ message: 'Error fetching user leagues' });
  }
});

module.exports = router;
