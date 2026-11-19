/**
 * Waste Record Mongoose Model
 */

const mongoose = require('mongoose');

const wasteRecordSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['BIOMEDICAL', 'INFECTIOUS', 'SHARPS', 'PHARMA', 'GENERAL'],
      default: 'BIOMEDICAL'
    },
    quantityKg: { type: Number, required: true },
    department: { type: String, default: 'General Hospital' },
    collectionTime: { type: String, default: new Date().toISOString().split('T')[0] },
    disposalStatus: {
      type: String,
      enum: ['COLLECTED', 'STORED', 'DISPOSED'],
      default: 'COLLECTED'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('WasteRecord', wasteRecordSchema);
