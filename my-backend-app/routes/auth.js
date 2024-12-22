const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  // Basic validation
  if (!email || !password || !username) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create new user without manually hashing the password
    const newUser = new User({
      email,
      password,  // Do not hash the password here; the pre-save hook will handle it
      username,
    });

    console.log('Saving new user with password:', password);  // This will log the plain password
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log In
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt with:', email, password);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Found user:', user);

    // Log the password comparison in more detail
    console.log('Password entered by user:', password);
    console.log('Stored hashed password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if picks are submitted
    const picksSubmitted = user.picksSubmitted;

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log("User object:", user);  // Check the user object

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id, 
      picksSubmitted,  // Include picksSubmitted status in the response
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
