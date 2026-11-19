/**
 * Bed Mongoose Model
 */

const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema(
  {
    bedId: { type: String, required: true, unique: true }, // e.g. "ICU-01"
    number: { type: String, required: true },
    category: {
      type: String,
      enum: ['GENERAL', 'ICU', 'EMERGENCY', 'PRIVATE', 'ISOLATION'],
      default: 'GENERAL'
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE', 'RESERVED'],
      default: 'AVAILABLE'
    },
    roomNumber: { type: String, default: '101' },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bed', bedSchema);
