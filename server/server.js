/**
 * MediSense Express API Gateway - Main Entry Point
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to Database
connectDB();

// 3. Initialize Express Application
const app = express();

// 4. Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 5. API Routes Mount
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/queue', require('./routes/queueRoutes'));
app.use('/api/operations', require('./routes/operationsRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/journey', require('./routes/journeyRoutes'));
app.use('/api/intelligence', require('./routes/intelligenceRoutes'));

// 6. System Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'MediSense Express Backend Gateway',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 7. Centralized 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 8. Centralized Error Handler Middleware
app.use(errorHandler);

// 9. Start HTTP Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`[MediSense Backend] Express server running on port ${PORT}`);
  console.log(`[MediSense Backend] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[MediSense Backend] Health check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
