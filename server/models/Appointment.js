/**
 * Appointment Mongoose Model
 * 
 * Concept: Manages scheduling relationship between Patient and Doctor.
 * Enforces non-overlapping slot reservations and tracks appointment lifecycle status.
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true,
      required: true // e.g. "APT-1001"
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
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Please specify appointment date']
    },
    timeSlot: {
      type: String, // e.g. "10:30 AM"
      required: [true, 'Please select a time slot']
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_consultation', 'completed', 'cancelled'],
      default: 'scheduled'
    },
    priority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL'],
      default: 'NORMAL'
    },
    type: {
      type: String,
      enum: ['OPD Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'],
      default: 'OPD Consultation'
    },
    reasonForVisit: {
      type: String,
      default: 'General Consultation'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate doctor slot bookings on the same date and time
appointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
