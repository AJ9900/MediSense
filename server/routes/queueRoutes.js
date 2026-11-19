/**
 * Queue Express Routes Definition
 */

const express = require('express');
const router = express.Router();
const {
  generateToken,
  getPatientToken,
  getLiveQueueStatus,
  callNextToken
} = require('../controllers/queueController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/live/:doctorId', getLiveQueueStatus);

// Protected endpoints
router.post('/token', protect, generateToken);
router.get('/patient', protect, authorize('patient'), getPatientToken);
router.put('/next/:doctorId', protect, authorize('doctor', 'staff'), callNextToken);

module.exports = router;
