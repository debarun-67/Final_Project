const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadRecord } = require('../controllers/recordController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Only doctors can upload records
router.post('/upload', authMiddleware, roleMiddleware(['doctor']), upload.single('record'), uploadRecord);

module.exports = router;
