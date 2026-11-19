/**
 * AI Controller
 */

const aiClient = require('../services/aiClient');

const handleTriage = async (req, res, next) => {
  try {
    const { symptoms, age, gender } = req.body;
    const response = await aiClient.post('/ai/triage', { symptoms, age, gender });
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('[AI Controller Error] Triage service call failed:', error.message);
    // Fallback response if AI service is offline
    res.status(200).json({
      success: true,
      data: {
        priorityLevel: 'MEDIUM',
        recommendedDepartment: 'General Medicine',
        confidenceScore: 0.70,
        triageReason: 'Default offline triage fallback.',
        isEmergency: false,
        disclaimer: 'AI-generated preliminary prioritization. Final medical decision belongs to qualified staff.'
      }
    });
  }
};

const handleChat = async (req, res, next) => {
  try {
    const { query, language } = req.body;
    const response = await aiClient.post('/ai/chat', { query, language });
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(200).json({
      success: true,
      data: {
        reply: 'Hello! I am the MediSense AI Assistant. Please select a doctor or department from your dashboard.',
        language: 'en',
        disclaimer: 'AI-generated informational guidance. Not a medical diagnosis.'
      }
    });
  }
};

const handleWaitingTimePrediction = async (req, res, next) => {
  try {
    const response = await aiClient.post('/ai/predict-waiting-time', req.body);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
};

const handleReportSummarizer = async (req, res, next) => {
  try {
    const { reportText } = req.body;
    const response = await aiClient.post('/ai/summarize-report', { reportText });
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleTriage,
  handleChat,
  handleWaitingTimePrediction,
  handleReportSummarizer
};
