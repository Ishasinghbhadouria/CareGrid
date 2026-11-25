const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const QueueToken = require('../models/QueueToken');
const EmergencyAlert = require('../models/EmergencyAlert');
const CareTask = require('../models/CareTask');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/caregrid';

async function seedDatabase() {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    await QueueToken.deleteMany({});
    await EmergencyAlert.deleteMany({});
    await CareTask.deleteMany({});

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password@123', salt);

    console.log('Creating initial Role-Based Users...');
    // 1. Admin
    const adminUser = await User.create({
      fullName: 'Dr. Kedar Dharmatti',
      email: 'admin@caregrid.health',
      password: hashedPassword,
      phone: '+91 98260 11223',
      role: 'admin',
      initials: 'KD',
      hospitalDetails: {
        hospitalName: 'CarePlus Super-Speciality Hospital',
        hospitalRegNo: 'MOHFW-MP-2024-9982',
        hospitalType: 'Super-Speciality Tertiary Care',
        adminDesignation: 'Medical Superintendent & Director',
        totalBeds: 500,
        occupiedBeds: 412,
        icuBeds: 60,
        occupiedIcuBeds: 48,
        ambulanceCount: 8,
        city: 'Indore',
        state: 'Madhya Pradesh'
      }
    });

    // 2. Doctor
    const doctorUser = await User.create({
      fullName: 'Dr. Arvind Sharma',
      email: 'dr.sharma@caregrid.health',
      password: hashedPassword,
      phone: '+91 94250 88991',
      role: 'doctor',
      initials: 'AS',
      doctorDetails: {
        medicalRegNo: 'NMC-CARD-88412-2018',
        specialization: 'Cardiology Specialist',
        hospitalAffiliation: 'CarePlus Multi-Speciality Medical Center',
        qualification: 'MBBS, MD (Cardiology), DM',
        experienceYears: 14,
        consultationMode: 'Both OPD & Telehealth',
        opdRoomNo: 'Chamber 3B',
        isAvailableToday: true,
        opdTimings: '09:30 AM - 02:30 PM'
      }
    });

    // 3. Caretaker
    const caretakerUser = await User.create({
      fullName: 'Aditya Vyas',
      email: 'aditya.vyas@caregrid.health',
      password: hashedPassword,
      phone: '+91 98765 43210',
      role: 'caretaker',
      initials: 'AV',
      patientDetails: {
        patientSubtype: 'caretaker',
        caretakerPatientId: 'CG-PAT-9021',
        emergencyContactName: 'Isha Singh',
        emergencyContactRelation: 'Sister',
        emergencyContactPhone: '+91 91234 56789'
      }
    });

    // 4. Patient
    const patientUser = await User.create({
      fullName: 'Isha Singh',
      email: 'isha.singh@caregrid.health',
      password: hashedPassword,
      phone: '+91 91234 56789',
      role: 'patient',
      initials: 'IS',
      patientDetails: {
        patientSubtype: 'patient',
        uhid: 'CG-PAT-9021',
        abhaId: '91-8841-9923-1100',
        dob: new Date('2004-03-18'),
        gender: 'Female',
        bloodGroup: 'B+',
        emergencyContactName: 'Aditya Vyas',
        emergencyContactRelation: 'Family Caregiver',
        emergencyContactPhone: '+91 98765 43210',
        existingConditions: 'Seasonal Dust Allergy'
      }
    });

    console.log('Seeding initial Appointments...');
    await Appointment.create([
      {
        patientId: patientUser._id,
        patientName: patientUser.fullName,
        doctorId: doctorUser._id,
        doctorName: doctorUser.fullName,
        specialty: 'Cardiology Specialist',
        clinic: 'CarePlus Medical Center • OPD Clinic',
        date: '15 Oct 2026',
        time: '10:30 AM',
        type: 'in-person',
        status: 'confirmed',
        tokenNumber: 42
      },
      {
        patientId: patientUser._id,
        patientName: patientUser.fullName,
        doctorName: 'Dr. Ananya Sen',
        specialty: 'Dermatologist & Allergy',
        clinic: 'Metro Health Telehealth Video Room',
        date: '22 Oct 2026',
        time: '03:00 PM',
        type: 'video',
        status: 'confirmed',
        tokenNumber: 15
      }
    ]);

    console.log('Seeding initial Medical Records...');
    await MedicalRecord.create([
      {
        patientId: patientUser._id,
        patientName: patientUser.fullName,
        title: 'Lipid Profile & Comprehensive Metabolic Panel',
        category: 'lab_report',
        doctorOrLab: 'CarePlus Diagnostics & Pathology Lab',
        recordDate: '02 Nov 2026',
        fileSize: '1.4 MB',
        fileType: 'PDF',
        tags: ['Cholesterol', 'Fasting Blood Sugar', 'Routine']
      },
      {
        patientId: patientUser._id,
        patientName: patientUser.fullName,
        title: 'Cardiology Consultation Prescription & Echo ECG',
        category: 'prescription',
        doctorOrLab: 'Dr. Arvind Sharma (Cardiology)',
        recordDate: '15 Oct 2026',
        fileSize: '850 KB',
        fileType: 'PDF',
        tags: ['Cardiology', 'ECG', 'Prescription']
      }
    ]);

    console.log('Seeding initial OPD Queue Tokens...');
    await QueueToken.create([
      {
        tokenNumber: 39,
        patientName: 'Kavita R.',
        doctorName: doctorUser.fullName,
        chamberNumber: 'Chamber 3B',
        status: 'in-chamber',
        estimatedWaitMinutes: 0
      },
      {
        tokenNumber: 40,
        patientName: 'Devendra S.',
        doctorName: doctorUser.fullName,
        chamberNumber: 'Chamber 3B',
        status: 'waiting',
        estimatedWaitMinutes: 5
      },
      {
        tokenNumber: 41,
        patientName: 'Pooja M.',
        doctorName: doctorUser.fullName,
        chamberNumber: 'Chamber 3B',
        status: 'waiting',
        estimatedWaitMinutes: 10
      },
      {
        tokenNumber: 42,
        patientId: patientUser._id,
        patientName: patientUser.fullName,
        doctorName: doctorUser.fullName,
        chamberNumber: 'Chamber 3B',
        status: 'waiting',
        estimatedWaitMinutes: 15
      }
    ]);

    console.log('Seeding initial CareTasks...');
    await CareTask.create([
      {
        patientId: patientUser._id,
        caretakerId: caretakerUser._id,
        title: 'Metformin 500mg',
        timing: 'Morning • After breakfast',
        type: 'medication',
        taken: true,
        completedAt: new Date()
      },
      {
        patientId: patientUser._id,
        caretakerId: caretakerUser._id,
        title: 'Vitamin D3 60k IU',
        timing: 'Afternoon • Once weekly',
        type: 'medication',
        taken: false
      },
      {
        patientId: patientUser._id,
        caretakerId: caretakerUser._id,
        title: 'Atorvastatin 10mg',
        timing: 'Night • Before bed',
        type: 'medication',
        taken: false
      }
    ]);

    console.log('🎉 Database seeded successfully with demo CareGrid data!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();

