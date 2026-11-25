const mongoose = require('mongoose');
const QueueToken = require('../models/QueueToken');

const FALLBACK_QUEUE = [
  {
    _id: 'q_39',
    tokenNumber: 39,
    patientName: 'Kavita Rathore',
    doctorName: 'Dr. Rajesh Gupta',
    chamberNumber: 'Chamber 3B',
    status: 'in-chamber',
    estimatedWaitMinutes: 0
  },
  {
    _id: 'q_40',
    tokenNumber: 40,
    patientName: 'Devendra Sharma',
    doctorName: 'Dr. Rajesh Gupta',
    chamberNumber: 'Chamber 3B',
    status: 'waiting',
    estimatedWaitMinutes: 6
  },
  {
    _id: 'q_41',
    tokenNumber: 41,
    patientName: 'Pooja Mishra',
    doctorName: 'Dr. Rajesh Gupta',
    chamberNumber: 'Chamber 3B',
    status: 'waiting',
    estimatedWaitMinutes: 12
  },
  {
    _id: 'q_42',
    tokenNumber: 42,
    patientName: 'Isha Singh (You)',
    doctorName: 'Dr. Rajesh Gupta',
    chamberNumber: 'Chamber 3B',
    status: 'waiting',
    estimatedWaitMinutes: 18
  }
];

// @desc    Get current OPD queue status
// @route   GET /api/queue/status
// @access  Public / Private
exports.getQueueStatus = async (req, res) => {
  try {
    let queue = [];
    if (mongoose.connection.readyState === 1) {
      queue = await QueueToken.find({ status: { $in: ['waiting', 'in-chamber'] } }).sort({ tokenNumber: 1 });
    }

    if (queue.length === 0) {
      queue = FALLBACK_QUEUE;
    }

    res.status(200).json({
      success: true,
      currentServingToken: 39,
      totalInQueue: queue.length,
      userToken: 42,
      estimatedWaitMinutes: 12,
      data: queue
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
