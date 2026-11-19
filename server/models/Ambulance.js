/**
 * Ambulance Mongoose Model
 */

const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, unique: true }, // e.g. "DL-01-AMB-101"
    driverName: { type: String, required: true },
    driverPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ['AVAILABLE', 'DISPATCHED', 'MAINTENANCE'],
      default: 'AVAILABLE'
    },
    currentLocation: { type: String, default: 'Hospital Base' },
    emergencyLevel: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'NORMAL', 'NONE'],
      default: 'NONE'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ambulance', ambulanceSchema);
