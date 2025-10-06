// my-backend-app/models/League.js
const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    joinCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Optional: Index joinCode for faster lookups
leagueSchema.index({ joinCode: 1 });

const League = mongoose.model('League', leagueSchema);

module.exports = League;
