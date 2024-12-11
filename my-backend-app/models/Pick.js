const mongoose = require('mongoose');

// Pick Schema
const pickSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  pick: {
    type: String, // Either 'team1' or 'team2'
    required: true
  }
});

const Pick = mongoose.model('Pick', pickSchema);

module.exports = Pick;
