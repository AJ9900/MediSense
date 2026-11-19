/**
 * Appointment Controller
 */

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Token = require('../models/Token');
const Queue = require('../models/Queue');

const departmentPrefixes = {
  'Cardiology': 'A',
  'Neurology': 'B',
  'Orthopedics': 'C',
  'Pediatrics': 'D',
  'General Medicine': 'E',
  'Dermatology': 'F',
  'Emergency': 'EM'
};

// @desc    Create a new appointment booking & auto-allocate Digital Token
// @route   POST /api/appointments
// @access  Private (Patient only)
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, priority, type, reasonForVisit } = req.body;

    // 1. Get logged in patient profile
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: 'Patient profile not found. Please complete registration.'
      });
    }

    // 2. Check if selected doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor not found'
      });
    }

    // 3. Check if slot is already booked for this doctor on selected date
    const existingSlot = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: `Time slot ${timeSlot} on ${date} is already booked. Please choose another slot.`
      });
    }

    // 4. Generate unique appointmentId
    const count = await Appointment.countDocuments();
    const appointmentId = `APT-${1000 + count + 1}`;

    // 5. Create Appointment document
    const appointment = await Appointment.create({
      appointmentId,
      patientId: patient._id,
      doctorId,
      date,
      timeSlot,
      priority: priority || 'NORMAL',
      type: type || 'OPD Consultation',
      reasonForVisit: reasonForVisit || 'General Consultation'
    });

    // 6. AUTO-GENERATE DIGITAL TOKEN (Minimum-Queue Engine)
    const todayStr = new Date().toISOString().split('T')[0];
    const tokenCount = await Token.countDocuments({
      doctorId,
      createdAt: { $gte: new Date(todayStr) }
    });

    const tokenNum = 101 + tokenCount;
    const prefix = departmentPrefixes[doctor.department] || 'A';
    const tokenId = `${prefix}-${tokenNum}`;

    const token = await Token.create({
      tokenId,
      tokenNumber: tokenNum,
      prefix,
      appointmentId: appointment._id,
      patientId: patient._id,
      doctorId,
      department: doctor.department,
      priorityLevel: priority || 'NORMAL',
      status: 'WAITING'
    });

    // Update Queue waiting count
    await Queue.findOneAndUpdate(
      { doctorId },
      { department: doctor.department, $inc: { waitingCount: 1 } },
      { upsert: true, new: true }
    );

    // Populate patient & doctor metadata
    const populated = await Appointment.findById(appointment._id)
      .populate({ path: 'patientId', populate: { path: 'userId', select: 'name email phone' } })
      .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email phone' } });

    res.status(201).json({
      success: true,
      message: `Appointment booked! Digital Token ${tokenId} allocated.`,
      data: {
        appointment: populated,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for logged-in patient
// @route   GET /api/appointments/patient
// @access  Private (Patient only)
const getPatientAppointments = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private (Doctor only)
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      return res.status(400).json({ success: false, message: 'Doctor profile not found' });
    }

    const { date } = req.query;
    let query = { doctorId: doctor._id };
    if (date) {
      query.date = date;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patientId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
