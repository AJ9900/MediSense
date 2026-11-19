/**
 * Database Seed Script for MediSense
 * 
 * Concept: Populates MongoDB with initial demo accounts for all 4 user roles.
 * Allows quick testing during development and college viva presentations.
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

dotenv.config({ path: '../.env' });

const seedUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medisense';
    await mongoose.connect(mongoUri);
    console.log(`[Seed Script] Connected to MongoDB: ${mongoUri}`);

    // Clear existing users to avoid duplicates
    await User.deleteMany();
    await Patient.deleteMany();
    await Doctor.deleteMany();
    console.log(`[Seed Script] Cleared existing users and profiles.`);

    // 1. Create Patient User
    const patientUser = await User.create({
      name: 'Ananya Roy',
      email: 'patient@medisense.com',
      password: 'password123',
      role: 'patient',
      phone: '+91 9876543210',
      language: 'en'
    });
    await Patient.create({
      userId: patientUser._id,
      patientId: 'M1001',
      age: 28,
      gender: 'Female',
      bloodGroup: 'B+'
    });
    console.log(`[Seed Script] Created Patient Demo: patient@medisense.com / password123`);

    // 2. Create Doctor User
    const doctorUser = await User.create({
      name: 'Dr. Vikram Sharma',
      email: 'doctor@medisense.com',
      password: 'password123',
      role: 'doctor',
      phone: '+91 9876543211',
      language: 'en'
    });
    await Doctor.create({
      userId: doctorUser._id,
      doctorId: 'DOC101',
      department: 'Cardiology',
      specialization: 'Interventional Cardiologist',
      qualification: 'MD, DM (Cardiology)',
      experienceYears: 12,
      rating: 4.9,
      roomNumber: '204'
    });
    console.log(`[Seed Script] Created Doctor Demo: doctor@medisense.com / password123`);

    // 3. Create Staff User
    await User.create({
      name: 'Priya Verma',
      email: 'staff@medisense.com',
      password: 'password123',
      role: 'staff',
      phone: '+91 9876543212',
      language: 'en'
    });
    console.log(`[Seed Script] Created Staff Demo: staff@medisense.com / password123`);

    // 4. Create Admin User
    await User.create({
      name: 'Dr. Rajesh Gupta',
      email: 'admin@medisense.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 9876543213',
      language: 'en'
    });
    console.log(`[Seed Script] Created Admin Demo: admin@medisense.com / password123`);

    console.log(`[Seed Script] Seeding complete! Exiting...`);
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Script Error]:`, error.message);
    process.exit(1);
  }
};

seedUsers();
