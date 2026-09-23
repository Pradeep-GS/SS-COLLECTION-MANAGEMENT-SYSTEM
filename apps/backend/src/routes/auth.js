require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { Staff } = require('../models/Staff');
const { JWT_SECRET } = require('../middlewares/auth');
const { getIsConnected } = require('../db/mongoClient');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected. Please try again.' });
  }

  try {
    const staff = await Staff.findOne({ email: email.toLowerCase().trim(), isActive: true });

    if (!staff) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isValid = await staff.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const payload = {
      id: staff._id.toString(),
      email: staff.email,
      name: staff.name,
      role: staff.role,
      staffType: staff.staffType || null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      data: {
        token,
        user: payload
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

// GET /api/v1/auth/me
router.get('/me', (req, res) => {
  return res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;
