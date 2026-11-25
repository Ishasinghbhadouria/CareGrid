const mongoose = require('mongoose');

const EmergencyAlertSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    patientName: {
      type: String,
      required: true
    },
    emergencyContactPhone: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['dispatched', 'en-route', 'arrived', 'hospital-admitted', 'resolved'],
      default: 'dispatched'
    },
    ambulanceUnit: {
      type: String,
      default: 'ResQCare Unit #108'
    },
    hospitalName: {
      type: String,
      default: 'CarePlus Super-Speciality Hospital'
    },
    traumaBay: {
      type: String,
      default: 'Trauma ER Bay #4 Reserved'
    },
    location: {
      address: {
        type: String,
        default: 'Geolocated Live Coordinates'
      },
      latitude: {
        type: Number,
        default: 22.7196
      },
      longitude: {
        type: Number,
        default: 75.8577
      }
    },
    estimatedArrivalTime: {
      type: String,
      default: '6-8 mins'
    },
    paramedicNotes: {
      type: String,
      default: 'Cardiac/Respiratory emergency protocol initiated.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EmergencyAlert', EmergencyAlertSchema);

