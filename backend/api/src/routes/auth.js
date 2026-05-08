const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.get('/me', authMiddleware, getMe);

module.exports = router;
