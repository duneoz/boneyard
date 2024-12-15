const mongoose = require('mongoose');

// Game Schema
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  team1: {
    type: String,
    required: true
  },
  team2: {
    type: String,
    required: true
  },
  spread: {
    type: String,
    required: true
  },
  winner: {
    type: String, // Will store the winner after the game is played (team1 or team2)
    required: false
  }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
  