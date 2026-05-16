const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadRecord, verifyRecord } = require('../controllers/recordController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Only doctors can upload records
router.post('/upload', authMiddleware, roleMiddleware(['doctor']), upload.single('record'), uploadRecord);

// Anyone can verify a file against the chain (no auth required — integrity is public)
router.post('/verify', upload.single('record'), verifyRecord);

module.exports = router;
