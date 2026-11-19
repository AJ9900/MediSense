/**
 * Doctor Profile Mongoose Model
 * 
 * Concept: Stores doctor specialization, department, ratings, and availability schedule.
 */

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    doctorId: {
      type: String,
      unique: true,
      required: true // e.g. "DOC101"
    },
    department: {
      type: String,
      required: [true, 'Please specify doctor department'],
      enum: [
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'General Medicine',
        'Dermatology',
        'Radiology',
        'Emergency'
      ]
    },
    specialization: {
      type: String,
      required: [true, 'Please specify specialization']
    },
    qualification: {
      type: String,
      default: 'MBBS'
    },
    experienceYears: {
      type: Number,
      default: 5
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1.0,
      max: 5.0
    },
    roomNumber: {
      type: String,
      default: '101'
    },
    slotDurationMinutes: {
      type: Number,
      default: 15
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    isAvailableToday: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
