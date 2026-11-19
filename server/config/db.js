/**
 * Database Connection Manager (MongoDB & Mongoose)
 * Supports primary MongoDB server with zero-config in-memory fallback.
 */

const mongoose = require('mongoose');

let mongoMemoryServer = null;

const seedInitialData = async () => {
  try {
    const User = require('../models/User');
    const Patient = require('../models/Patient');
    const Doctor = require('../models/Doctor');
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[Database] Auto-seeding initial demo accounts and doctors...');

      // 1. Patient User
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

      // 2. Doctor Roster covering all major hospital departments
      const doctorRoster = [
        {
          name: 'Dr. Vikram Sharma',
          email: 'doctor@medisense.com',
          role: 'doctor',
          phone: '+91 9876543211',
          doctorId: 'DOC101',
          department: 'Cardiology',
          specialization: 'Interventional Cardiologist',
          qualification: 'MD, DM (Cardiology)',
          experienceYears: 14,
          rating: 4.9,
          roomNumber: '204'
        },
        {
          name: 'Dr. Neha Sengupta',
          email: 'neha.sengupta@medisense.com',
          role: 'doctor',
          phone: '+91 9876543222',
          doctorId: 'DOC102',
          department: 'Neurology',
          specialization: 'Consultant Neurologist',
          qualification: 'MBBS, MD, DM (Neuro)',
          experienceYears: 11,
          rating: 4.8,
          roomNumber: '302'
        },
        {
          name: 'Dr. Arvind Rao',
          email: 'arvind.rao@medisense.com',
          role: 'doctor',
          phone: '+91 9876543223',
          doctorId: 'DOC103',
          department: 'General Medicine',
          specialization: 'Senior Physician & Diabetologist',
          qualification: 'MBBS, MD (Medicine)',
          experienceYears: 18,
          rating: 4.9,
          roomNumber: '105'
        },
        {
          name: 'Dr. Pooja Nair',
          email: 'pooja.nair@medisense.com',
          role: 'doctor',
          phone: '+91 9876543224',
          doctorId: 'DOC104',
          department: 'Pediatrics',
          specialization: 'Pediatric Specialist',
          qualification: 'MBBS, DCH, DNB (Pediatrics)',
          experienceYears: 9,
          rating: 4.9,
          roomNumber: '108'
        },
        {
          name: 'Dr. Sameer Kulkarni',
          email: 'sameer.kulkarni@medisense.com',
          role: 'doctor',
          phone: '+91 9876543225',
          doctorId: 'DOC105',
          department: 'Orthopedics',
          specialization: 'Joint Replacement & Spine',
          qualification: 'MBBS, MS (Ortho)',
          experienceYears: 15,
          rating: 4.7,
          roomNumber: '210'
        },
        {
          name: 'Dr. Aditi Mehra',
          email: 'aditi.mehra@medisense.com',
          role: 'doctor',
          phone: '+91 9876543226',
          doctorId: 'DOC106',
          department: 'Dermatology',
          specialization: 'Clinical & Cosmetic Dermatologist',
          qualification: 'MBBS, MD (Dermatology)',
          experienceYears: 8,
          rating: 4.8,
          roomNumber: '112'
        }
      ];

      for (const doc of doctorRoster) {
        const docUser = await User.create({
          name: doc.name,
          email: doc.email,
          password: 'password123',
          role: 'doctor',
          phone: doc.phone,
          language: 'en'
        });
        await Doctor.create({
          userId: docUser._id,
          doctorId: doc.doctorId,
          department: doc.department,
          specialization: doc.specialization,
          qualification: doc.qualification,
          experienceYears: doc.experienceYears,
          rating: doc.rating,
          roomNumber: doc.roomNumber,
          isAvailableToday: true
        });
      }

      // 3. Staff User
      await User.create({
        name: 'Priya Verma',
        email: 'staff@medisense.com',
        password: 'password123',
        role: 'staff',
        phone: '+91 9876543212',
        language: 'en'
      });

      // 4. Admin User
      await User.create({
        name: 'Dr. Rajesh Gupta',
        email: 'admin@medisense.com',
        password: 'password123',
        role: 'admin',
        phone: '+91 9876543213',
        language: 'en'
      });

      console.log('[Database] Auto-seeding completed successfully!');
    }
  } catch (seedErr) {
    console.error('[Database Seed Error]:', seedErr.message);
  }
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medisense';

  try {
    // Attempt standard connection with 3-second timeout
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    await seedInitialData();
  } catch (primaryError) {
    console.warn(`[Database Notice] Could not connect to primary MongoDB (${primaryError.message}).`);
    console.log('[Database] Initializing MongoMemoryServer fallback for zero-config operation...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] In-Memory MongoDB Connected at: ${memoryUri}`);
      await seedInitialData();
    } catch (memError) {
      console.error('[Database Error] Failed to start fallback database:', memError.message);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
