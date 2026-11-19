/**
 * Patient Profile Mongoose Model
 * 
 * Concept: Linking schemas via ObjectId references (ref: 'User').
 * This separates generic authentication data (User) from clinical profile data (Patient).
 */

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    patientId: {
      type: String,
      unique: true,
      required: true // e.g. "M1001"
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Unspecified'],
      default: 'Unspecified'
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown'
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' }
    },
    medicalHistory: [{
      condition: String,
      diagnosedYear: String,
      notes: String
    }],
    activeJourneyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PatientJourney',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Patient', patientSchema);
