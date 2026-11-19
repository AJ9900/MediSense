/**
 * Oxygen Resource Mongoose Model
 */

const mongoose = require('mongoose');

const oxygenResourceSchema = new mongoose.Schema(
  {
    totalCylinders: { type: Number, default: 50 },
    availableCylinders: { type: Number, default: 38 },
    mainTankLevelPercent: { type: Number, default: 78.5 }, // 0 to 100%
    icuDailyConsumptionRate: { type: Number, default: 12.0 } // Liters/min
  },
  { timestamps: true }
);

module.exports = mongoose.model('OxygenResource', oxygenResourceSchema);
