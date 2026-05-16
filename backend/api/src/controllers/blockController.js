const { runCoreCommand } = require('../config/core_bridge');
const { parseBlockOutput } = require('../utils/parser');
const { logEvent } = require('../utils/logger');

const getBlocks = async (req, res) => {
    try {
        logEvent('INFO', 'Client requested full blockchain history');
        const output = await runCoreCommand('ALL');
        const blocks = parseBlockOutput(output);
        logEvent('INFO', `Successfully parsed ${blocks.length} blocks`);
        // Show newest blocks first
        res.json(blocks.reverse());
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getBlockByIndex = async (req, res) => {
    const { index } = req.params;
    try {
        const output = await runCoreCommand('PRINT', [index]);
        const blocks = parseBlockOutput(output);
        if (blocks.length === 0) {
            return res.status(404).json({ error: 'Block not found' });
        }
        res.json(blocks[0]);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getHeight = async (req, res) => {
    try {
        const output = await runCoreCommand('HEIGHT');
        res.json({ height: parseInt(output.split(':')[1]) || 0 });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const verifyChain = async (req, res) => {
    try {
        logEvent('INFO', 'Full chain cryptographic audit initiated');
        const output = await runCoreCommand('VERIFY');
        logEvent('INFO', `VERIFY Output: ${output.trim()}`);
        const isValid = output.includes('VALID');
        res.json({ valid: isValid });
    } catch (error) {
        logEvent('ERROR', `Audit failed: ${error}`);
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { getBlocks, getBlockByIndex, getHeight, verifyChain };
