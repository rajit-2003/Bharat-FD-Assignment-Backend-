// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  const { username, password, preferredLanguage } = req.body;

  const user = new User({ username, password, preferredLanguage });

  try {
    await user.save(); // Save new user to database
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, preferredLanguage: user.preferredLanguage }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
