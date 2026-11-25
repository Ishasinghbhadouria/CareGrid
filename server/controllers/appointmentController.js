const Appointment = require('../models/Appointment');

// @desc    Get all appointments (filtered by current user or role)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient' || req.user.role === 'caretaker') {
      query = { patientId: req.user.id };
    } else if (req.user.role === 'doctor') {
      query = { doctorId: req.user.id };
    }
    // Admin can view all

    let appointments = await Appointment.find(query).sort({ createdAt: -1 });

    // Fallback initial appointments if DB is empty
    if (appointments.length === 0) {
      appointments = [
        {
          _id: '1',
          doctorName: 'Dr. Sharma',
          specialty: 'Cardiology Specialist',
          clinic: 'CarePlus Medical Center • OPD Clinic',
          date: '15 Oct 2026',
          time: '10:30 AM',
          type: 'in-person',
          status: 'confirmed',
          patientName: req.user.name || 'Isha Singh'
        },
        {
          _id: '2',
          doctorName: 'Dr. Ananya Sen',
          specialty: 'Dermatologist & Allergy',
          clinic: 'Metro Health Telehealth Video Room',
          date: '22 Oct 2026',
          time: '03:00 PM',
          type: 'video',
          status: 'confirmed',
          patientName: req.user.name || 'Isha Singh'
        },
        {
          _id: '3',
          doctorName: 'Dr. Rajesh Gupta',
          specialty: 'General Medicine & OPD',
          clinic: 'City CarePlus OPD Chamber 3B',
          date: '10 Sep 2026',
          time: '11:15 AM',
          type: 'in-person',
          status: 'completed',
          patientName: req.user.name || 'Isha Singh'
        }
      ];
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { doctorName, specialty, clinic, date, time, type = 'in-person', reasonForVisit } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user.id,
      patientName: req.user.name || 'Patient',
      doctorName,
      specialty: specialty || 'General OPD',
      clinic: clinic || 'CarePlus Medical Center',
      date,
      time,
      type,
      reasonForVisit,
      tokenNumber: Math.floor(Math.random() * 50) + 1,
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      message: `Appointment confirmed with ${doctorName}!`,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status (e.g. complete, cancel)
// @route   PATCH /api/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

