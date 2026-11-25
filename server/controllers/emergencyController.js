const mongoose = require('mongoose');
const EmergencyAlert = require('../models/EmergencyAlert');
const {
  emergencySosDispatchesTotal,
  activeEmergenciesGauge,
  ambulanceUnitsStatus
} = require('../metrics');

let latestInMemoryAlert = null;

// @desc    Trigger emergency SOS dispatch
// @route   POST /api/emergency/sos
// @access  Private / Public
exports.triggerSos = async (req, res) => {
  try {
    const {
      address,
      latitude,
      longitude,
      paramedicNotes,
      emergencyType,
      ambulanceUnit,
      traumaBay
    } = req.body;

    const payload = {
      _id: 'sos_' + Date.now(),
      patientId: req.user ? req.user.id : undefined,
      patientName: req.user ? req.user.name : 'Emergency Patient (Isha Singh)',
      emergencyContactPhone: '+91 98765 43210',
      status: 'dispatched',
      stage: 'en-route',
      emergencyType: emergencyType || 'Rapid Emergency SOS',
      ambulanceUnit: ambulanceUnit || 'ResQCare AMB-108',
      hospitalName: 'CarePlus Super-Speciality Hospital',
      traumaBay: traumaBay || 'Bay #01',
      location: {
        address: address || 'Scheme 54, Vijay Nagar, Indore',
        latitude: latitude || 22.7533,
        longitude: longitude || 75.8937
      },
      estimatedArrivalTime: '5-6 mins',
      paramedicNotes: paramedicNotes || 'High-priority ResQCare SOS dispatch initiated.',
      createdAt: new Date().toISOString()
    };

    emergencySosDispatchesTotal.inc({ category: payload.emergencyType });
    activeEmergenciesGauge.set(1);
    ambulanceUnitsStatus.set({ status: 'standby' }, 6);
    ambulanceUnitsStatus.set({ status: 'en_route' }, 1);

    if (mongoose.connection.readyState === 1) {
      const alert = await EmergencyAlert.create(payload);
      latestInMemoryAlert = alert;
      return res.status(201).json({
        success: true,
        message: `${payload.ambulanceUnit} dispatched to ${payload.location.address}.`,
        data: alert
      });
    }

    latestInMemoryAlert = payload;
    return res.status(201).json({
      success: true,
      message: `${payload.ambulanceUnit} dispatched to ${payload.location.address}.`,
      data: latestInMemoryAlert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update active emergency dispatch stage
// @route   PATCH /api/emergency/stage
// @access  Private / Public
exports.updateEmergencyStage = async (req, res) => {
  try {
    const { stage, ambulanceUnit, traumaBay } = req.body;

    if (stage === 'resolved') {
      activeEmergenciesGauge.set(0);
      ambulanceUnitsStatus.set({ status: 'standby' }, 7);
      ambulanceUnitsStatus.set({ status: 'en_route' }, 0);
      if (latestInMemoryAlert) {
        latestInMemoryAlert = { ...latestInMemoryAlert, status: 'resolved', stage: 'resolved' };
      }
      return res.status(200).json({ success: true, active: false, data: latestInMemoryAlert });
    }

    if (latestInMemoryAlert) {
      latestInMemoryAlert = {
        ...latestInMemoryAlert,
        stage: stage || latestInMemoryAlert.stage,
        ambulanceUnit: ambulanceUnit || latestInMemoryAlert.ambulanceUnit,
        traumaBay: traumaBay || latestInMemoryAlert.traumaBay,
        status: 'dispatched'
      };
    }

    return res.status(200).json({
      success: true,
      active: !!latestInMemoryAlert,
      data: latestInMemoryAlert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current emergency status
// @route   GET /api/emergency/status
// @access  Public
exports.getEmergencyStatus = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const alert = await EmergencyAlert.findOne().sort({ createdAt: -1 });
      if (alert) latestInMemoryAlert = alert;
    }

    const active = !!latestInMemoryAlert && latestInMemoryAlert.status !== 'resolved';
    res.status(200).json({
      success: true,
      active,
      data: latestInMemoryAlert
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
