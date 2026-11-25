const express = require('express');
const router = express.Router();
const { getQueueStatus } = require('../controllers/queueController');

router.get('/status', getQueueStatus);

module.exports = router;

