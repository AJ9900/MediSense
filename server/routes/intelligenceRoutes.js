/**
 * Intelligence Express Routes Definition
 */

const express = require('express');
const router = express.Router();
const { 
  getDemandForecast, 
  getBottleneckAlerts, 
  queryHospitalCopilot,
  runWhatIfSimulation 
} = require('../controllers/intelligenceController');

router.get('/forecast', getDemandForecast);
router.get('/bottlenecks', getBottleneckAlerts);
router.post('/copilot', queryHospitalCopilot);
router.post('/simulator', runWhatIfSimulation);

module.exports = router;
