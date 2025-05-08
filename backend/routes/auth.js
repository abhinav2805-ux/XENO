// Backend: routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

// User Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with UUID for NextAuth compatibility
    const newUser = new User({
      id: uuidv4(),  // Generate UUID for NextAuth compatibility
      email,
      username,
      password: hashedPassword,
      name: username, // Set name same as username initially
    });

    await newUser.save();

    // Return user object without password for client-side
    const userForClient = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.username
    };

    res.status(201).json(userForClient);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// User Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return user object without password for NextAuth
    const userForAuth = {
      id: user.id,
      email: user.email,
      name: user.username || user.name
    };

    res.status(200).json(userForAuth);
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error during signin' });
  }
});

module.exports = router;