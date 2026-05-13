const express = require('express');
const router = express.Router();
const { getBlocks, getBlockByIndex, getHeight, verifyChain } = require('../controllers/blockController');
const { authMiddleware } = require('../middleware/auth');

router.get('/height', getHeight);
router.get('/blocks', getBlocks);
router.get('/block/:index', getBlockByIndex);
router.get('/verify', verifyChain);

module.exports = router;
