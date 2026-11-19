/**
 * Token Mongoose Model
 * 
 * Concept: Represents a digital queue token allocated to a patient.
 * Replaces physical paper tokens and physical counter lines.
 */

const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String, // e.g. "A-101"
      required: true,
      unique: true
    },
    tokenNumber: {
      type: Number,
      required: true // Numeric index for sorting (e.g. 101)
    },
    prefix: {
      type: String, // e.g. "A" for Cardiology, "B" for General Medicine
      default: 'A'
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    department: {
      type: String,
      required: true
    },
    priorityLevel: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL'],
      default: 'NORMAL'
    },
    status: {
      type: String,
      enum: ['WAITING', 'CALLING', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED'],
      default: 'WAITING'
    },
    positionInQueue: {
      type: Number,
      default: 0
    },
    estimatedWaitMinutes: {
      type: Number,
      default: 15
    },
    calledAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for fast queue position queries
tokenSchema.index({ doctorId: 1, status: 1, priorityLevel: 1, tokenNumber: 1 });

module.exports = mongoose.model('Token', tokenSchema);
