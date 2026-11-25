const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'doctor', 'patient', 'caretaker'],
        message: 'Role must be admin, doctor, patient, or caretaker'
      },
      default: 'patient'
    },
    initials: {
      type: String,
      default: 'CG'
    },
    avatarUrl: {
      type: String,
      default: ''
    },

    // --- Hospital Administrator Profile Fields ---
    hospitalDetails: {
      hospitalName: { type: String, default: '' },
      hospitalRegNo: { type: String, default: '' },
      hospitalType: {
        type: String,
        default: 'Multi-Speciality Hospital'
      },
      adminDesignation: {
        type: String,
        default: 'Medical Superintendent'
      },
      totalBeds: { type: Number, default: 350 },
      occupiedBeds: { type: Number, default: 280 },
      icuBeds: { type: Number, default: 45 },
      occupiedIcuBeds: { type: Number, default: 38 },
      ambulanceCount: { type: Number, default: 8 },
      city: { type: String, default: 'Indore' },
      state: { type: String, default: 'Madhya Pradesh' }
    },

    // --- Doctor / Specialist Profile Fields ---
    doctorDetails: {
      medicalRegNo: { type: String, default: '' }, // NMC Registration ID
      specialization: { type: String, default: 'General Medicine' },
      hospitalAffiliation: { type: String, default: 'CarePlus Medical Center' },
      qualification: { type: String, default: 'MBBS, MD' },
      experienceYears: { type: Number, default: 5 },
      consultationMode: {
        type: String,
        enum: ['In-Person OPD', 'Telehealth Video', 'Both OPD & Telehealth'],
        default: 'Both OPD & Telehealth'
      },
      opdRoomNo: { type: String, default: 'Chamber 1A' },
      isAvailableToday: { type: Boolean, default: true },
      opdTimings: { type: String, default: '09:00 AM - 02:00 PM' }
    },

    // --- Patient & Caregiver Profile Fields ---
    patientDetails: {
      patientSubtype: {
        type: String,
        enum: ['patient', 'caretaker'],
        default: 'patient'
      },
      uhid: { type: String, default: '' }, // Unique Health ID (ABHA)
      abhaId: { type: String, default: '' },
      dob: { type: Date },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        default: 'Female'
      },
      bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
        default: 'B+'
      },
      emergencyContactName: { type: String, default: '' },
      emergencyContactRelation: { type: String, default: '' },
      emergencyContactPhone: { type: String, default: '' },
      existingConditions: { type: String, default: '' },
      allergies: { type: String, default: '' },
      caretakerPatientId: { type: String, default: '' } // Linked patient if user is caretaker
    },

    isVerified: {
      type: Boolean,
      default: true
    },
    consentDataSharing: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook: Hash password and generate initials
UserSchema.pre('save', async function (next) {
  if (this.fullName) {
    const parts = this.fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      this.initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      this.initials = parts[0].slice(0, 2).toUpperCase();
    }
  }

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT signed token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email,
      name: this.fullName
    },
    process.env.JWT_SECRET || 'caregrid_fallback_secret_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

module.exports = mongoose.model('User', UserSchema);

