const mongoose = require('mongoose');

// Pick Schema
const pickSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  selectedWinner: { type: String, required: true },
  isCorrect: { type: Boolean, default: null },
  confidence: { type: Number, required: true }, // New field for confidence level
});


const Pick = mongoose.model('Pick', pickSchema);

module.exports = Pick;
