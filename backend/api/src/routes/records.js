const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadRecord, verifyRecord, decryptRecord } = require('../controllers/recordController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Only doctors and admins can upload records
router.post('/upload', authMiddleware, roleMiddleware(['doctor', 'admin']), upload.single('record'), uploadRecord);

// Anyone can verify a file against the chain (no auth required — integrity is public)
router.post('/verify', upload.single('record'), verifyRecord);

// Doctors or Patients can decrypt records using their identity
router.post('/decrypt', authMiddleware, decryptRecord);

module.exports = router;
