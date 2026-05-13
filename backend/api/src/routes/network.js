const express = require('express');
const router = express.Router();
const { getNetworkHealth } = require('../controllers/networkController');

router.get('/health', getNetworkHealth);

module.exports = router;
