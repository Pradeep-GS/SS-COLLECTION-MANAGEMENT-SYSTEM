const express = require('express');
const { requireRole } = require('../middlewares/auth');
const { Customer } = require('../models/Customer');
const { getIsConnected } = require('../db/mongoClient');

const router = express.Router();

// Helper: filter customer data based on role
function filterCustomerForRole(customer, user) {
  const raw = typeof customer.toJSON === 'function' ? customer.toJSON() : customer;

  if (user.role === 'ADMIN') {
    return raw; // Admin gets everything
  }

  if (user.role === 'STAFF' && user.staffType === 'FULL_DETAIL') {
    // Full Detail Staff: name, phone, customerCode, measurements (read-only)
    return {
      id: raw.id,
      customerCode: raw.customerCode,
      fullName: raw.fullName,
      phoneNumber: raw.phoneNumber,
      measurements: raw.measurements,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }

  if (user.role === 'STAFF' && user.staffType === 'TAILOR') {
    // Tailor: name, customerCode, measurements only — NO phone
    return {
      id: raw.id,
      customerCode: raw.customerCode,
      fullName: raw.fullName,
      measurements: raw.measurements,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }

  // Fallback: minimal
  return {
    id: raw.id,
    customerCode: raw.customerCode,
    fullName: raw.fullName,
    createdAt: raw.createdAt
  };
}

// GET /api/v1/customers
router.get('/', async (req, res) => {
  const search = (req.query.search || '').trim();

  if (!getIsConnected()) {
    return res.status(503).json({
      success: false,
      error: 'Database is not connected. Please check MongoDB connection.'
    });
  }

  try {
    let filter = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter = {
        $or: [
          { fullName: searchRegex },
          { phoneNumber: searchRegex },
          { customerCode: searchRegex }
        ]
      };
    }

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();

    const filtered = customers.map(c => filterCustomerForRole(c, req.user));

    return res.json({
      success: true,
      source: 'MONGODB_DATABASE',
      data: {
        total: filtered.length,
        customers: filtered
      }
    });
  } catch (err) {
    console.error('MongoDB fetch exception:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/customers/:id
router.get('/:id', async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { customerCode: req.params.id };

    const customer = await Customer.findOne(query);

    if (customer) {
      return res.json({
        success: true,
        source: 'MONGODB_DATABASE',
        data: filterCustomerForRole(customer, req.user)
      });
    }

    return res.status(404).json({ success: false, error: 'Customer record not found' });
  } catch (e) {
    console.error('MongoDB get single error:', e.message);
    return res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/v1/customers — Admin only: insert into MongoDB
router.post('/', requireRole(['ADMIN']), async (req, res) => {
  const { fullName, phoneNumber, garmentType, measurementData, notes } = req.body;

  if (!fullName || !phoneNumber) {
    return res.status(400).json({ success: false, error: 'Customer name and phone number are required.' });
  }

  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  const nextCode = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const initialMeasurements = (garmentType && measurementData) ? [{
      garmentType,
      version: 1,
      isLatest: true,
      data: measurementData,
      notes: notes || '',
      createdAt: new Date()
    }] : [];

    const newCustomer = new Customer({
      customerCode: nextCode,
      fullName,
      phoneNumber,
      measurements: initialMeasurements
    });

    const saved = await newCustomer.save();

    return res.status(201).json({
      success: true,
      source: 'MONGODB_DATABASE',
      data: saved.toJSON()
    });
  } catch (err) {
    console.error('MongoDB insert exception:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/v1/customers/:id — Admin only
router.put('/:id', requireRole(['ADMIN']), async (req, res) => {
  const { fullName, phoneNumber, garmentType, measurementData, notes } = req.body;

  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { customerCode: req.params.id };

    const customer = await Customer.findOne(query);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found.' });
    }

    if (fullName) customer.fullName = fullName;
    if (phoneNumber) customer.phoneNumber = phoneNumber;

    if (garmentType && measurementData) {
      // Mark existing measurements of this garmentType as non-latest
      customer.measurements.forEach(m => {
        if (m.garmentType === garmentType) {
          m.isLatest = false;
        }
      });

      const existingSameGarment = customer.measurements.filter(m => m.garmentType === garmentType);
      const nextVersion = existingSameGarment.length + 1;

      customer.measurements.unshift({
        garmentType,
        version: nextVersion,
        isLatest: true,
        data: measurementData,
        notes: notes || '',
        createdAt: new Date()
      });
    }

    const updatedCustomer = await customer.save();

    return res.json({
      success: true,
      source: 'MONGODB_DATABASE',
      data: updatedCustomer.toJSON(),
      message: 'Customer record updated successfully.'
    });
  } catch (err) {
    console.error('MongoDB update exception:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/customers/:id/instructions — Staff & Admin: add instruction/note
router.post('/:id/instructions', async (req, res) => {
  const { note, garmentType } = req.body;

  if (!note || !note.trim()) {
    return res.status(400).json({ success: false, error: 'Instruction note is required.' });
  }

  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { customerCode: req.params.id };

    const customer = await Customer.findOne(query);
    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found.' });
    }

    // Find the latest measurement for this garment type (or the first one)
    const targetGarmentType = garmentType || (customer.measurements.length > 0 ? customer.measurements[0].garmentType : null);

    if (targetGarmentType) {
      const latestMeasurement = customer.measurements.find(
        m => m.garmentType === targetGarmentType && m.isLatest !== false
      );
      if (latestMeasurement) {
        const existingNotes = latestMeasurement.notes || '';
        const timestamp = new Date().toLocaleString('en-IN');
        const staffName = req.user.name || req.user.email;
        latestMeasurement.notes = existingNotes
          ? `${existingNotes}\n[${timestamp} - ${staffName}]: ${note.trim()}`
          : `[${timestamp} - ${staffName}]: ${note.trim()}`;
      }
    }

    await customer.save();

    return res.json({
      success: true,
      message: 'Instruction added successfully.'
    });
  } catch (err) {
    console.error('Add instruction error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/customers/:id — Admin only
router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  if (!getIsConnected()) {
    return res.status(503).json({ success: false, error: 'Database not connected.' });
  }

  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { customerCode: req.params.id };

    const result = await Customer.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found.' });
    }

    return res.json({
      success: true,
      source: 'MONGODB_DATABASE',
      message: 'Customer record deleted from database.'
    });
  } catch (err) {
    console.error('MongoDB delete exception:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
