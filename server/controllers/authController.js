const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { authEventsTotal } = require('../metrics');

// In-memory resilience store for seamless operation when MongoDB is offline
const inMemoryUsers = new Map();

// Helper to send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const action = statusCode === 201 ? 'register' : 'login';
  if (user && user.role) {
    authEventsTotal.inc({ role: user.role, action });
  }

  const token = user.generateAuthToken
    ? user.generateAuthToken()
    : jwt.sign(
        { id: user._id || 'mock_id', role: user.role, email: user.email },
        process.env.JWT_SECRET || 'caregrid_jwt_secret',
        { expiresIn: '7d' }
      );

  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj
  });
};

// @desc    Register a new user with specific role
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = 'patient',
      phone,
      // Role-specific payloads
      hospitalName,
      hospitalRegNo,
      hospitalType,
      adminDesignation,
      totalBeds,
      icuBeds,
      city,
      state,
      ambulanceCount,
      medicalRegNo,
      specialization,
      hospitalAffiliation,
      qualification,
      experienceYears,
      consultationMode,
      opdRoomNo,
      patientSubtype,
      dob,
      gender,
      bloodGroup,
      emergencyContactName,
      emergencyContactRelation,
      emergencyContactPhone,
      existingConditions,
      caretakerPatientId,
      abhaId,
      consentDataSharing
    } = req.body;

    const lowerEmail = email ? email.toLowerCase() : '';

    // If MongoDB is offline, use fast in-memory resilience store
    if (mongoose.connection.readyState !== 1) {
      if (inMemoryUsers.has(lowerEmail)) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const mockUser = {
        _id: 'usr_' + Date.now(),
        fullName,
        email: lowerEmail,
        role,
        phone: phone || '',
        consentDataSharing: !!consentDataSharing,
        createdAt: new Date().toISOString()
      };

      if (role === 'admin') {
        mockUser.hospitalDetails = {
          hospitalName: hospitalName || 'CarePlus Super-Speciality Hospital',
          hospitalRegNo: hospitalRegNo || '',
          hospitalType: hospitalType || 'Super-Speciality Hospital (Tertiary Care)',
          adminDesignation: adminDesignation || 'Medical Superintendent',
          totalBeds: Number(totalBeds) || 400,
          icuBeds: Number(icuBeds) || 45,
          city: city || 'Indore',
          state: state || 'Madhya Pradesh',
          ambulanceCount: Number(ambulanceCount) || 8
        };
      } else if (role === 'doctor') {
        mockUser.doctorDetails = {
          medicalRegNo: medicalRegNo || '',
          specialization: specialization || 'Cardiology Specialist',
          hospitalAffiliation: hospitalAffiliation || 'CarePlus Medical Center',
          qualification: qualification || 'MBBS, MD (Medicine), DM (Cardiology)',
          experienceYears: Number(experienceYears) || 8,
          consultationMode: consultationMode || 'Both OPD & Telehealth',
          opdRoomNo: opdRoomNo || 'Chamber 3B'
        };
      } else {
        mockUser.patientDetails = {
          patientSubtype: patientSubtype || role,
          dob: dob || '2004-03-18',
          gender: gender || 'Female',
          bloodGroup: bloodGroup || 'B+',
          emergencyContactName: emergencyContactName || '',
          emergencyContactRelation: emergencyContactRelation || '',
          emergencyContactPhone: emergencyContactPhone || '',
          existingConditions: existingConditions || '',
          caretakerPatientId: caretakerPatientId || '',
          abhaId: abhaId || ''
        };
      }

      inMemoryUsers.set(lowerEmail, { ...mockUser, password });
      return sendTokenResponse(mockUser, 201, res, `Account successfully registered as ${role.toUpperCase()}`);
    }

    // Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Assemble role-specific details
    const userData = {
      fullName,
      email: email.toLowerCase(),
      password,
      role,
      phone: phone || '',
      consentDataSharing: !!consentDataSharing
    };

    if (role === 'admin') {
      userData.hospitalDetails = {
        hospitalName: hospitalName || 'CarePlus Hospital',
        hospitalRegNo: hospitalRegNo || '',
        hospitalType: hospitalType || 'Multi-Speciality Hospital',
        adminDesignation: adminDesignation || 'Medical Superintendent',
        totalBeds: Number(totalBeds) || 350,
        icuBeds: Number(icuBeds) || 45,
        city: city || 'Indore',
        state: state || 'Madhya Pradesh',
        ambulanceCount: Number(ambulanceCount) || 8
      };
    } else if (role === 'doctor') {
      userData.doctorDetails = {
        medicalRegNo: medicalRegNo || '',
        specialization: specialization || 'General Medicine',
        hospitalAffiliation: hospitalAffiliation || 'CarePlus Medical Center',
        qualification: qualification || 'MBBS, MD',
        experienceYears: Number(experienceYears) || 5,
        consultationMode: consultationMode || 'Both OPD & Telehealth',
        opdRoomNo: opdRoomNo || 'Chamber 1A'
      };
    } else {
      // patient or caretaker
      userData.patientDetails = {
        patientSubtype: patientSubtype || role,
        dob: dob ? new Date(dob) : undefined,
        gender: gender || 'Female',
        bloodGroup: bloodGroup || 'B+',
        emergencyContactName: emergencyContactName || '',
        emergencyContactRelation: emergencyContactRelation || '',
        emergencyContactPhone: emergencyContactPhone || '',
        existingConditions: existingConditions || '',
        caretakerPatientId: caretakerPatientId || '',
        abhaId: abhaId || ''
      };
    }

    const user = await User.create(userData);
    sendTokenResponse(user, 201, res, `Account successfully created as ${role.toUpperCase()}`);
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during user registration.'
    });
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const lowerEmail = email.toLowerCase();

    // In-memory fallback if MongoDB is not connected
    if (mongoose.connection.readyState !== 1) {
      const user = inMemoryUsers.get(lowerEmail);
      if (user && user.password === password) {
        return sendTokenResponse(user, 200, res, 'Logged in successfully.');
      } else if (!user) {
        // Fallback for demo logins
        const role = lowerEmail.includes('admin') ? 'admin' : lowerEmail.includes('doctor') ? 'doctor' : lowerEmail.includes('care') ? 'caretaker' : 'patient';
        const demoUser = {
          _id: 'usr_demo_' + Date.now(),
          fullName: role === 'admin' ? 'Dr. Kedar Dharmatti' : role === 'doctor' ? 'Dr. Arvind Sharma' : role === 'caretaker' ? 'Aditya Vyas' : 'Isha Singh',
          email: lowerEmail,
          role,
          phone: '+91 98260 11223'
        };
        inMemoryUsers.set(lowerEmail, { ...demoUser, password });
        return sendTokenResponse(demoUser, 200, res, 'Logged in successfully.');
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Incorrect password.'
        });
      }
    }

    // Check for user (include password field for comparison)
    const user = await User.findOne({ email: lowerEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully.');
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login.'
    });
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private (JWT protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch current user profile.'
    });
  }
};

// @desc    Demo role switcher for university presentation
// @route   POST /api/auth/demo-switch/:role
// @access  Public
exports.demoSwitchRole = async (req, res) => {
  try {
    const { role } = req.params;
    const allowed = ['admin', 'doctor', 'patient', 'caretaker'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid demo role' });
    }

    let user = await User.findOne({ role });
    if (!user) {
      // Find any user or return standard demo user
      user = {
        _id: '65f1234567890abcdef12345',
        fullName: role === 'admin' ? 'Dr. Kedar Dharmatti' : role === 'doctor' ? 'Dr. Arvind Sharma' : role === 'caretaker' ? 'Aditya Vyas' : 'Isha Singh',
        role,
        email: `${role}@caregrid.health`,
        initials: role === 'admin' ? 'KD' : role === 'doctor' ? 'AS' : role === 'caretaker' ? 'AV' : 'IS',
        generateAuthToken: () => 'demo_jwt_token_' + role
      };
    }

    sendTokenResponse(user, 200, res, `Switched to demo ${role} role.`);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

