const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  picksSubmitted: {
    type: Boolean,
    default: false
  },
  leaguesJoined: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  }
  ]
});

// Encrypt password before saving (using bcrypt)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Only hash the password if it's modified

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
