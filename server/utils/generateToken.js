/**
 * JWT Token Generator Helper
 * 
 * Concept: JSON Web Tokens (JWT) consist of 3 parts: Header, Payload, and Signature.
 * We encode user._id and user.role inside the payload signed with our JWT_SECRET.
 * This token is stateless — the client includes it in headers on subsequent API requests.
 */

const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'medisense_super_secret_jwt_key_btech_cse_2026',
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;
