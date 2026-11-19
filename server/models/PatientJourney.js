/**
 * Patient Journey Mongoose Model (Digital Twin Timeline)
 * 
 * Concept: Represents the live digital twin of a patient's end-to-end hospital visit.
 * Orchestrates multi-step sequential tasks: Registration -> Triage -> Doctor -> Lab -> X-Ray -> Pharmacy.
 */

const mongoose = require('mongoose');

const patientJourneySchema = new mongoose.Schema(
  {
    journeyId: { type: String, required: true, unique: true }, // e.g. "JRN-1001"
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    steps: [
      {
        stepName: { type: String, required: true }, // e.g. "Doctor Consultation", "Blood Test", "X-Ray"
        location: { type: String, default: 'Reception' }, // e.g. "Room #204", "Lab 102", "Radiology B"
        estimatedTime: { type: String, required: true }, // e.g. "10:30 AM"
        actualTime: { type: String, default: null },
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'],
          default: 'PENDING'
        }
      }
    ],
    currentStepIndex: { type: Number, default: 0 },
    estimatedExitTime: { type: String, default: '12:45 PM' },
    isCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PatientJourney', patientJourneySchema);
