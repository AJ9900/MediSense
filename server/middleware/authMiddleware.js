/**
 * Authentication & Role-Based Authorization Middlewares
 * 
 * Concept: Middleware functions intercept incoming HTTP requests before they reach controller logic.
 * - protect: Verifies JWT token and attaches authenticated user to req.user.
 * - authorize: Enforces Role-Based Access Control (RBAC) by checking user role against allowed roles.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect Routes: Verifies JWT token in Authorization header
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header (Format: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature using JWT_SECRET
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'medisense_super_secret_jwt_key_btech_cse_2026'
      );

      // Fetch user from DB excluding password field and attach to req.user
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists. Authorization failed.'
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware Error] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Invalid or expired token.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided in headers.'
    });
  }
};

// Grant access to specific roles (e.g. authorize('admin', 'doctor'))
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. User role '${req.user?.role}' is not authorized to access this route.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
