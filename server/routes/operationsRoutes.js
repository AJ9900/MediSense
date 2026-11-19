/**
 * Operations Express Routes Definition
 */

const express = require('express');
const router = express.Router();
const {
  getBeds, updateBedStatus,
  getMedicines, addMedicine,
  getOxygenStatus, updateOxygenStatus,
  getWasteRecords, logWasteRecord,
  getAmbulances, dispatchAmbulance
} = require('../controllers/operationsController');
const { protect } = require('../middleware/authMiddleware');

// Beds
router.get('/beds', getBeds);
router.put('/beds/:id', protect, updateBedStatus);

// Medicines
router.get('/medicines', getMedicines);
router.post('/medicines', protect, addMedicine);

// Oxygen
router.get('/oxygen', getOxygenStatus);
router.put('/oxygen', protect, updateOxygenStatus);

// Waste
router.get('/waste', getWasteRecords);
router.post('/waste', protect, logWasteRecord);

// Ambulances
router.get('/ambulances', getAmbulances);
router.put('/ambulances/:id', protect, dispatchAmbulance);

module.exports = router;
