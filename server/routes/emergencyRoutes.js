const express = require('express');
const router = express.Router();
const {
  triggerSos,
  updateEmergencyStage,
  getEmergencyStatus
} = require('../controllers/emergencyController');

router.post('/sos', triggerSos);
router.patch('/stage', updateEmergencyStage);
router.get('/status', getEmergencyStatus);

module.exports = router;
