/**
 * AI Express Routes Definition
 */

const express = require('express');
const router = express.Router();
const {
  handleTriage,
  handleChat,
  handleWaitingTimePrediction,
  handleReportSummarizer
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/triage', handleTriage);
router.post('/chat', handleChat);
router.post('/predict-waiting-time', handleWaitingTimePrediction);
router.post('/summarize-report', handleReportSummarizer);

module.exports = router;
