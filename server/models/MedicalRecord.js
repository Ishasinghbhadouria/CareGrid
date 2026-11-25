const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required']
    },
    patientName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: [true, 'Record title is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['lab_report', 'prescription', 'scan_imaging', 'discharge_summary', 'vaccination', 'other'],
      default: 'lab_report'
    },
    doctorOrLab: {
      type: String,
      default: 'CarePlus Diagnostics & Imaging Hub'
    },
    recordDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    fileSize: {
      type: String,
      default: '1.2 MB'
    },
    fileType: {
      type: String,
      default: 'PDF'
    },
    fileUrl: {
      type: String,
      default: ''
    },
    sha256Hash: {
      type: String,
      default: () => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    isEncrypted: {
      type: Boolean,
      default: true
    },
    tags: [
      {
        type: String
      }
    ],
    clinicalSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);

