const mongoose = require('mongoose');

const CareTaskSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    caretakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    timing: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['medication', 'vital_check', 'appointment', 'diet', 'exercise'],
      default: 'medication'
    },
    dosage: {
      type: String,
      default: ''
    },
    taken: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    recordedBy: {
      type: String,
      default: 'Self / Caretaker'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CareTask', CareTaskSchema);

