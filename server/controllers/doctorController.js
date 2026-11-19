/**
 * Doctor Controller
 * 
 * Concept: Handles doctor directory lookups, department filtering, rating sorting, 
 * and live slot availability calculations.
 */

const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors with optional department/search filters
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res, next) => {
  try {
    const { department, search, minRating } = req.query;

    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let doctors = await Doctor.find(query)
      .populate({
        path: 'userId',
        select: 'name email phone language'
      })
      .sort({ rating: -1, experienceYears: -1 });

    // Filter by doctor name if search query is provided
    if (search) {
      const searchLower = search.toLowerCase();
      doctors = doctors.filter(doc => 
        doc.userId?.name?.toLowerCase().includes(searchLower) ||
        doc.specialization?.toLowerCase().includes(searchLower) ||
        doc.department?.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor details & available time slots for a given date
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email phone');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const { date } = req.query; // YYYY-MM-DD
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Standard working time slots for hospital OPD
    const allSlots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    // Fetch existing booked appointments for this doctor on the selected date
    const bookedAppointments = await Appointment.find({
      doctorId: doctor._id,
      date: targetDate,
      status: { $ne: 'cancelled' }
    });

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

    // Calculate available slots
    const availableSlots = allSlots.map(slot => ({
      slot,
      isBooked: bookedSlots.includes(slot)
    }));

    res.status(200).json({
      success: true,
      data: {
        doctor,
        date: targetDate,
        slots: availableSlots
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor availability status
// @route   PUT /api/doctors/availability
// @access  Private (Doctor only)
const updateAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const { isAvailableToday, slotDurationMinutes } = req.body;

    if (isAvailableToday !== undefined) doctor.isAvailableToday = isAvailableToday;
    if (slotDurationMinutes !== undefined) doctor.slotDurationMinutes = slotDurationMinutes;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor availability updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  updateAvailability
};
