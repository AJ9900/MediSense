/**
 * Patient Journey Controller (Orchestrator & Digital Twin)
 */

const PatientJourney = require('../models/PatientJourney');
const Patient = require('../models/Patient');

// @desc    Get active digital twin journey for patient
// @route   GET /api/journey/patient
// @access  Private (Patient)
const getPatientJourney = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient profile not found' });
    }

    let journey = await PatientJourney.findOne({
      patientId: patient._id,
      isCompleted: false
    });

    // Auto-generate default demo journey if no active journey exists
    if (!journey) {
      const count = await PatientJourney.countDocuments();
      const journeyId = `JRN-${1000 + count + 1}`;
      journey = await PatientJourney.create({
        journeyId,
        patientId: patient._id,
        steps: [
          { stepName: 'Registration & AI Triage', location: 'Main Entrance Reception', estimatedTime: '10:00 AM', status: 'COMPLETED' },
          { stepName: 'Doctor Consultation (Cardiology)', location: 'OPD Room #204', estimatedTime: '10:30 AM', status: 'IN_PROGRESS' },
          { stepName: 'Diagnostic Blood Test', location: 'Central Pathology Lab #102', estimatedTime: '11:15 AM', status: 'PENDING' },
          { stepName: 'Chest X-Ray Imaging', location: 'Radiology Wing B', estimatedTime: '11:45 AM', status: 'PENDING' },
          { stepName: 'Doctor Report Review', location: 'OPD Room #204', estimatedTime: '12:15 PM', status: 'PENDING' },
          { stepName: 'Pharmacy Medicine Dispensing', location: 'Main Pharmacy Counter #3', estimatedTime: '12:35 PM', status: 'PENDING' }
        ],
        currentStepIndex: 1,
        estimatedExitTime: '12:50 PM'
      });
    }

    res.status(200).json({ success: true, data: journey });
  } catch (error) {
    next(error);
  }
};

// @desc    Advance to next journey step
// @route   PUT /api/journey/:id/advance
// @access  Private
const advanceJourneyStep = async (req, res, next) => {
  try {
    const journey = await PatientJourney.findById(req.params.id);
    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey record not found' });
    }

    if (journey.currentStepIndex < journey.steps.length) {
      // Mark current step as completed
      journey.steps[journey.currentStepIndex].status = 'COMPLETED';
      journey.steps[journey.currentStepIndex].actualTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Advance index
      if (journey.currentStepIndex + 1 < journey.steps.length) {
        journey.currentStepIndex += 1;
        journey.steps[journey.currentStepIndex].status = 'IN_PROGRESS';
      } else {
        journey.isCompleted = true;
      }

      await journey.save();
    }

    res.status(200).json({ success: true, data: journey });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatientJourney,
  advanceJourneyStep
};
