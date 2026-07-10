const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// SIGNUP ENDPOINT
// URL: POST http://localhost:5000/api/auth/signup
// What to send: { email: "test@gmail.com", password: "password123" }
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password (make it secret)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword
    });

    // Save to database
    await newUser.save();

    // Send success response
    res.status(201).json({ 
      message: 'User created successfully',
      userId: newUser._id 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// LOGIN ENDPOINT
// URL: POST http://localhost:5000/api/auth/login
// What to send: { email: "test@gmail.com", password: "password123" }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token (proof that user is logged in)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }  // Token valid for 7 days
    );

    // Send token to frontend
    res.status(200).json({ 
      message: 'Login successful',
      token,
      userId: user._id 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;