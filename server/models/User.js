/**
 * User Mongoose Model
 * 
 * Concept: Mongoose Schema defines the shape of documents within a MongoDB collection.
 * Pre-save hooks allow us to run logic (like password hashing) automatically before saving a document.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password from query results by default for security
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'staff', 'admin'],
      default: 'patient'
    },
    phone: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      enum: ['en', 'hi'], // English or Hindi for AI Chatbot
      default: 'en'
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

/**
 * Pre-Save Hook: Automatically hash password using bcrypt before saving to MongoDB
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance Method: Compare entered plain-text password with hashed password stored in DB
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
