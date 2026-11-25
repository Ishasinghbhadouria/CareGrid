const mongoose = require('mongoose');

const QueueTokenSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
      default: 'Dr. Rajesh Gupta'
    },
    department: {
      type: String,
      default: 'General Medicine & OPD'
    },
    chamberNumber: {
      type: String,
      default: 'Chamber 3B'
    },
    status: {
      type: String,
      enum: ['waiting', 'in-chamber', 'completed', 'skipped'],
      default: 'waiting'
    },
    estimatedWaitMinutes: {
      type: Number,
      default: 15
    },
    queuePosition: {
      type: Number,
      default: 1
    },
    calledAt: {
      type: Date
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('QueueToken', QueueTokenSchema);

