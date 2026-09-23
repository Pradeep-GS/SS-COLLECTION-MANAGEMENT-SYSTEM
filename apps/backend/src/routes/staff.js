const express = require('express');
const { Staff } = require('../models/Staff');
const { requireRole } = require('../middlewares/auth');
const { getIsConnected } = require('../db/mongoClient');

const router = express.Router();

// GET /api/v1/staff — Admin only: list all staff
router.get('/', requireRole(['ADMIN']), async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  try {
    const staffList = await Staff.find({ role: 'STAFF', isActive: true }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: {
        total: staffList.length,
        staff: staffList.map(s => s.toJSON())
      }
    });
  } catch (err) {
    console.error('Fetch staff error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/staff — Admin only: create staff member
router.post('/', requireRole(['ADMIN']), async (req, res) => {
  const { name, email, staffType } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Staff name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Staff email is required.' });
  }
  if (!staffType || !['TAILOR', 'FULL_DETAIL'].includes(staffType)) {
    return res.status(400).json({ success: false, error: 'Staff type must be TAILOR or FULL_DETAIL.' });
  }

  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  try {
    const existing = await Staff.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, error: 'A staff member with this email already exists.' });
    }

    const newStaff = new Staff({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: '123456', // default password — hashed by pre-save hook
      role: 'STAFF',
      staffType,
      isActive: true
    });

    const saved = await newStaff.save();

    return res.status(201).json({
      success: true,
      data: saved.toJSON(),
      message: `Staff member ${saved.name} created successfully.`
    });
  } catch (err) {
    console.error('Create staff error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/staff/:id — Admin only: deactivate staff
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, error: 'Staff member not found.' });
    }

    if (staff.role === 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Cannot remove an Admin account.' });
    }

    staff.isActive = false;
    await staff.save();

    return res.json({
      success: true,
      message: `Staff member ${staff.name} has been removed.`
    });
  } catch (err) {
    console.error('Remove staff error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
