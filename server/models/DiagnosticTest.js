/**
 * Diagnostic Test Mongoose Model
 */

const mongoose = require('mongoose');

const diagnosticTestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Complete Blood Count (CBC)", "Chest X-Ray"
    category: {
      type: String,
      enum: ['blood', 'xray', 'mri', 'ct', 'ecg', 'pathology'],
      default: 'blood'
    },
    durationMinutes: { type: Number, default: 20 },
    cost: { type: Number, default: 500 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiagnosticTest', diagnosticTestSchema);
