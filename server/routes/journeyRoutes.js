/**
 * Journey Express Routes Definition
 */

const express = require('express');
const router = express.Router();
const { getPatientJourney, advanceJourneyStep } = require('../controllers/journeyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/patient', protect, getPatientJourney);
router.put('/:id/advance', protect, advanceJourneyStep);

module.exports = router;
