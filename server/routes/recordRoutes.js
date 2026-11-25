const express = require('express');
const router = express.Router();
const { getMedicalRecords, createMedicalRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMedicalRecords)
  .post(createMedicalRecord);

module.exports = router;

