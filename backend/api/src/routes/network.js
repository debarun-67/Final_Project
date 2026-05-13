const express = require('express');
const router = express.Router();
const { getNetworkHealth, getNetworkLogs } = require('../controllers/networkController');

router.get('/health', getNetworkHealth);
router.get('/logs', getNetworkLogs);

module.exports = router;
