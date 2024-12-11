// Submit picks for a user
router.post('/submit', async (req, res) => {
  const { userId, picks } = req.body; // picks is an array of gameId and selectedWinner

  // Validate picks
  if (!Array.isArray(picks) || picks.length === 0) {
    return res.status(400).json({ message: 'No picks submitted' });
  }

  // Validate each pick structure
  for (const pick of picks) {
    if (!pick.gameId || !pick.selectedWinner) {
      return res.status(400).json({ message: 'Each pick must contain gameId and selectedWinner' });
    }
  }

  try {
    // Ensure the user has not already submitted picks
    const user = await User.findById(userId);
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
