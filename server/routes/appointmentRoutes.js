const express = require('express');
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id/status')
  .patch(updateAppointmentStatus);

module.exports = router;

