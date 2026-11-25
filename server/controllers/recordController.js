const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get all medical records for user
// @route   GET /api/records
// @access  Private
exports.getMedicalRecords = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient' || req.user.role === 'caretaker') {
      query = { patientId: req.user.id };
    }

    let records = await MedicalRecord.find(query).sort({ createdAt: -1 });

    if (records.length === 0) {
      records = [
        {
          _id: 'rec_1',
          title: 'Lipid Profile & Comprehensive Metabolic Panel',
          category: 'lab_report',
          doctorOrLab: 'CarePlus Diagnostics & Pathology Lab',
          recordDate: '02 Nov 2026',
          fileSize: '1.4 MB',
          fileType: 'PDF',
          isEncrypted: true,
          sha256Hash: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72',
          tags: ['Cholesterol', 'Fasting Blood Sugar', 'Routine']
        },
        {
          _id: 'rec_2',
          title: 'Cardiology Consultation Prescription & Echo ECG',
          category: 'prescription',
          doctorOrLab: 'Dr. Arvind Sharma (Cardiology)',
          recordDate: '15 Oct 2026',
          fileSize: '850 KB',
          fileType: 'PDF',
          isEncrypted: true,
          sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
          tags: ['Cardiology', 'ECG', 'Prescription']
        },
        {
          _id: 'rec_3',
          title: 'Chest Digital Radiography X-Ray (PA View)',
          category: 'scan_imaging',
          doctorOrLab: 'CarePlus Radiologic Imaging Center',
          recordDate: '10 Sep 2026',
          fileSize: '4.8 MB',
          fileType: 'DICOM',
          isEncrypted: true,
          sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          tags: ['Imaging', 'Chest X-Ray', 'Pulmonology']
        }
      ];
    }

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload / Add new medical record
// @route   POST /api/records
// @access  Private
exports.createMedicalRecord = async (req, res) => {
  try {
    const { title, category = 'lab_report', doctorOrLab, fileSize, fileType = 'PDF', tags = [] } = req.body;

    const record = await MedicalRecord.create({
      patientId: req.user.id,
      patientName: req.user.name || 'Patient',
      title,
      category,
      doctorOrLab: doctorOrLab || 'CarePlus Diagnostics',
      fileSize: fileSize || '1.1 MB',
      fileType,
      isEncrypted: true,
      tags: Array.isArray(tags) ? tags : [tags]
    });

    res.status(201).json({
      success: true,
      message: `Record "${title}" encrypted and saved to vault!`,
      data: record
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

