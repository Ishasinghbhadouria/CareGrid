const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required']
    },
    patientName: {
      type: String,
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required']
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      default: 'General OPD'
    },
    clinic: {
      type: String,
      default: 'CarePlus Multi-Speciality Medical Center'
    },
    date: {
      type: String, // formatted date e.g. "15 Oct 2026"
      required: true
    },
    time: {
      type: String, // formatted time e.g. "10:30 AM"
      required: true
    },
    type: {
      type: String,
      enum: ['in-person', 'video'],
      default: 'in-person'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed'
    },
    tokenNumber: {
      type: Number
    },
    reasonForVisit: {
      type: String,
      default: 'Routine health checkup / consultation'
    },
    doctorNotes: {
      type: String,
      default: ''
    },
    prescriptionSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);

