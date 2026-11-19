/**
 * Queue Mongoose Model
 * 
 * Concept: Maintains real-time operational state for a doctor or department queue.
 * Tracks currently called token, total waiting count, and average consultation speed.
 */

const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      unique: true
    },
    department: {
      type: String,
      required: true
    },
    currentTokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Token',
      default: null
    },
    waitingCount: {
      type: Number,
      default: 0
    },
    avgConsultationMinutes: {
      type: Number,
      default: 15
    },
    isQueueActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Queue', queueSchema);
