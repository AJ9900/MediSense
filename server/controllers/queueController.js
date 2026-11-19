/**
 * Queue Controller
 * 
 * Concept: Handles token allocation, priority ordering (Critical -> High -> Medium -> Normal),
 * queue position calculation, and estimated wait time calculation.
 */

const Token = require('../models/Token');
const Queue = require('../models/Queue');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

// Department prefix mapping for Viva token clarity
const departmentPrefixes = {
  'Cardiology': 'A',
  'Neurology': 'B',
  'Orthopedics': 'C',
  'Pediatrics': 'D',
  'General Medicine': 'E',
  'Dermatology': 'F',
  'Emergency': 'EM'
};

// Helper: Priority Weight Scoring for Priority Queue ordering
const priorityWeights = {
  'CRITICAL': 1,
  'HIGH': 2,
  'MEDIUM': 3,
  'NORMAL': 4
};

// @desc    Generate a new digital token for an appointment
// @route   POST /api/queue/token
// @access  Private
const generateToken = async (req, res, next) => {
  try {
    const { appointmentId, doctorId, priorityLevel } = req.body;

    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient profile not found' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Generate numeric token count for doctor today
    const todayStr = new Date().toISOString().split('T')[0];
    const tokenCount = await Token.countDocuments({
      doctorId,
      createdAt: { $gte: new Date(todayStr) }
    });

    const tokenNum = 101 + tokenCount;
    const prefix = departmentPrefixes[doctor.department] || 'A';
    const tokenId = `${prefix}-${tokenNum}`;

    // Create Token document
    const token = await Token.create({
      tokenId,
      tokenNumber: tokenNum,
      prefix,
      appointmentId: appointmentId || null,
      patientId: patient._id,
      doctorId,
      department: doctor.department,
      priorityLevel: priorityLevel || 'NORMAL',
      status: 'WAITING'
    });

    // Update or initialize Queue record for doctor
    await Queue.findOneAndUpdate(
      { doctorId },
      {
        department: doctor.department,
        $inc: { waitingCount: 1 }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Digital token generated successfully',
      data: token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active token & queue position for logged-in patient
// @route   GET /api/queue/patient
// @access  Private (Patient)
const getPatientToken = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient profile not found' });
    }

    // Find patient's latest active token
    const token = await Token.findOne({
      patientId: patient._id,
      status: { $in: ['WAITING', 'CALLING', 'IN_CONSULTATION'] }
    }).populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });

    if (!token) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active waiting token found'
      });
    }

    // Calculate queue position: count tokens ahead for the same doctor with higher priority or earlier token number
    const waitingTokens = await Token.find({
      doctorId: token.doctorId._id,
      status: 'WAITING',
      _id: { $ne: token._id }
    });

    // Priority Queue Sorting Logic
    const currentWeight = priorityWeights[token.priorityLevel] || 4;
    let positionAhead = 0;

    waitingTokens.forEach(t => {
      const tWeight = priorityWeights[t.priorityLevel] || 4;
      if (tWeight < currentWeight) {
        positionAhead++; // Higher priority token goes ahead
      } else if (tWeight === currentWeight && t.tokenNumber < token.tokenNumber) {
        positionAhead++; // Same priority, earlier token number goes ahead (FIFO)
      }
    });

    const doctorSlotDuration = token.doctorId.slotDurationMinutes || 15;
    const estimatedWaitMinutes = positionAhead * doctorSlotDuration;

    // Fetch current serving token for this doctor
    const currentServingToken = await Token.findOne({
      doctorId: token.doctorId._id,
      status: { $in: ['CALLING', 'IN_CONSULTATION'] }
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        positionInQueue: positionAhead + 1,
        tokensAhead: positionAhead,
        estimatedWaitMinutes,
        currentServingTokenId: currentServingToken?.tokenId || 'None'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live queue monitor status for a doctor / department
// @route   GET /api/queue/live/:doctorId
// @access  Public
const getLiveQueueStatus = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const currentToken = await Token.findOne({
      doctorId,
      status: { $in: ['CALLING', 'IN_CONSULTATION'] }
    }).populate({ path: 'patientId', populate: { path: 'userId', select: 'name' } });

    const upcomingTokens = await Token.find({
      doctorId,
      status: 'WAITING'
    }).sort({ priorityLevel: 1, tokenNumber: 1 }).limit(5);

    const totalWaiting = await Token.countDocuments({ doctorId, status: 'WAITING' });

    res.status(200).json({
      success: true,
      data: {
        doctorName: doctor.userId?.name,
        department: doctor.department,
        roomNumber: doctor.roomNumber,
        currentToken: currentToken || null,
        upcomingTokens,
        totalWaiting
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Call next token in line
// @route   PUT /api/queue/next/:doctorId
// @access  Private (Doctor / Staff)
const callNextToken = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    // 1. Complete currently serving token if present
    const currentToken = await Token.findOne({
      doctorId,
      status: { $in: ['CALLING', 'IN_CONSULTATION'] }
    });

    if (currentToken) {
      currentToken.status = 'COMPLETED';
      currentToken.completedAt = new Date();
      await currentToken.save();
    }

    // 2. Find next highest priority waiting token
    const waitingTokens = await Token.find({ doctorId, status: 'WAITING' });

    if (waitingTokens.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No more waiting patients in queue',
        data: null
      });
    }

    // Priority Sort ($\text{CRITICAL} \rightarrow \text{HIGH} \rightarrow \text{MEDIUM} \rightarrow \text{NORMAL}$)
    waitingTokens.sort((a, b) => {
      const wA = priorityWeights[a.priorityLevel] || 4;
      const wB = priorityWeights[b.priorityLevel] || 4;
      if (wA !== wB) return wA - wB;
      return a.tokenNumber - b.tokenNumber;
    });

    const nextToken = waitingTokens[0];
    nextToken.status = 'CALLING';
    nextToken.calledAt = new Date();
    await nextToken.save();

    res.status(200).json({
      success: true,
      message: `Now calling Token ${nextToken.tokenId}`,
      data: nextToken
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateToken,
  getPatientToken,
  getLiveQueueStatus,
  callNextToken
};
