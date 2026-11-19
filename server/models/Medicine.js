/**
 * Medicine Inventory Mongoose Model
 */

const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true }, // Antibiotics, Analgesic, Cardiac, etc.
    batchNumber: { type: String, required: true },
    stockQuantity: { type: Number, required: true, default: 100 },
    minStockThreshold: { type: Number, default: 20 },
    expiryDate: { type: String, required: true }, // YYYY-MM-DD
    unitPrice: { type: Number, default: 10.0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', medicineSchema);
