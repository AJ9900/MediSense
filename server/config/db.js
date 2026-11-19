/**
 * Database Connection Manager (MongoDB & Mongoose)
 * 
 * Concept: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
 * It manages relationships between data, provides schema validation, and translates between 
 * objects in code and the representation of those objects in MongoDB.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medisense', {
      // Modern Mongoose v6+ uses default connection options
    });

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error(`[Database Note] Make sure your local MongoDB server is running (e.g., mongod or MongoDB Compass)`);
    // Do not terminate process hard in development mode so server can still serve health check endpoints
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
