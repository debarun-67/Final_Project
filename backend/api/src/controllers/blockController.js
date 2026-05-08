const { runCoreCommand } = require('../config/core_bridge');
const { parseBlockOutput } = require('../utils/parser');

const getBlocks = async (req, res) => {
    try {
        // Fetch last blocks (this depends on the viewer's capabilities)
        // For demo, let's assume 'LAST' returns the full details of the latest block
        const output = await runCoreCommand('LAST');
        const blocks = parseBlockOutput(output);
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getBlockByIndex = async (req, res) => {
    const { index } = req.params;
    try {
        const output = await runCoreCommand(`PRINT ${index}`);
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
        const match = output.match(/Height: (\d+)/);
        res.json({ height: parseInt(match?.[1] || "0") });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { getBlocks, getBlockByIndex, getHeight };
