/**
 * Doctor Express Routes Definition
 */

const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, updateAvailability } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected endpoints (Doctor only)
router.put('/availability', protect, authorize('doctor'), updateAvailability);

module.exports = router;
