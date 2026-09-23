const mongoose = require('mongoose');
const { getIsConnected } = require('../db/mongoClient');

const MeasurementSchema = new mongoose.Schema({
  garmentType: { type: String, required: true },
  version: { type: Number, default: 1 },
  isLatest: { type: Boolean, default: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const CustomerSchema = new mongoose.Schema({
  customerCode: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, index: true },
  phoneNumber: { type: String, required: true, index: true },
  measurements: [MeasurementSchema]
}, {
  timestamps: true
});

CustomerSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.measurements) {
      ret.measurements = ret.measurements.map(m => {
        m.id = m._id ? m._id.toString() : m.id;
        delete m._id;
        return m;
      });
    }
    return ret;
  }
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = { Customer };
