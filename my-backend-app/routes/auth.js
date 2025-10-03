const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const cors = require('cors'); // Make sure to use CORS

// Enable CORS for all requests (for development)
router.use(cors());

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

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Log In
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Normalize email
  const normalizedEmail = email.toLowerCase();

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Login attempt with:', { email, password });
    }

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('User not found or invalid credentials');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (process.env.NODE_ENV === 'development') {
      console.log('Password match result:', isMatch);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log("User login successful:", { userId: user._id, picksSubmitted: user.picksSubmitted, username: user.username });

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      username: user.username, // Include username in response
      picksSubmitted: user.picksSubmitted, // Include picksSubmitted in response
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
