/**
 * FastAPI AI Microservice HTTP Client
 * 
 * Concept: Express acts as an API gateway. When Node receives AI requests,
 * it forwards them to the Python FastAPI microservice running on port 8000.
 */

const axios = require('axios');

const AI_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

const aiClient = axios.create({
  baseURL: AI_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000 // 10s timeout
});

module.exports = aiClient;
