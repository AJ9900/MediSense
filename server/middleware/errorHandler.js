/**
 * Centralized Express Error Handling Middleware
 * 
 * Concept: Middleware functions access request (req), response (res), and next middleware function.
 * Error-handling middleware function takes 4 arguments: (err, req, res, next).
 * This ensures all unhandled errors are formatted cleanly into JSON responses.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Mongoose Bad ObjectId Error (CastError)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found. Invalid ID format.';
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  console.error(`[Error Log] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
