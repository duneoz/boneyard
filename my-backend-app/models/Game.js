const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: String,      // Name of the game
  date: Date,        // Date and time of the game
  team1: String,     // Team 1 name
  team2: String,     // Team 2 name
  spread: String,    // Spread for the game
  winner: String,    // Actual winner after the game
  nextGameId: {      // The _id of the next game this game feeds into
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',     // Reference to the same 'Game' collection
    default: null,   // Null if there is no next game (e.g., the final)
  },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
