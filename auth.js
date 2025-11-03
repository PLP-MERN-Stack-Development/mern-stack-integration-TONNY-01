const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'Email already in use' });
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      user = new User({ name, email, passwordHash });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

// Login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
