const path = require('path');
const fs = require('fs');
const { runCoreCommand } = require('../config/core_bridge');

// Absolute path to the live demo node's offchain/records folder
const NODE1_OFFCHAIN = path.resolve(
    __dirname, '../../../../demo_instances/node1/offchain/records'
);
const VALIDATOR_PORT = 8001;

const uploadRecord = async (req, res) => {
    const { patient_id, doctor_id } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!patient_id || !doctor_id) {
        // Clean up temp upload
        fs.unlink(file.path, () => {});
        return res.status(400).json({ error: 'patient_id and doctor_id are required' });
    }

    // Ensure the offchain directory exists
    fs.mkdirSync(NODE1_OFFCHAIN, { recursive: true });

    // Give the stored file a stable name so re-upload of same file produces same hash
    const destName = `${file.filename}.enc`;
    const destPath = path.join(NODE1_OFFCHAIN, destName);
    const dataPointer = `offchain/records/${destName}`;

    try {
        // Copy uploaded file into the node's offchain/records (demo "encryption" step)
        fs.copyFileSync(file.path, destPath);
        // Remove the temp multer file
        fs.unlink(file.path, () => {});

        // Call C core: ADD <abs_source_path> <data_pointer> <patient_id> <doctor_id> <port>
        const output = await runCoreCommand('ADD', [
            destPath,
            dataPointer,
            patient_id,
            doctor_id,
            String(VALIDATOR_PORT)
        ]);

        const trimmed = (output || '').trim();

        if (trimmed.startsWith('ADDED|')) {
            // ADDED|<block_index>|<hash>|<pointer>
            const [, blockIndex, dataHash, pointer] = trimmed.split('|');
            return res.json({
                success: true,
                message: 'Record encrypted and committed to the blockchain.',
                block_index: parseInt(blockIndex, 10),
                data_hash: dataHash,
                data_pointer: pointer,
                patient_id,
                doctor_id
            });
        }

        if (trimmed.startsWith('DUPLICATE|')) {
            const [, dupHash] = trimmed.split('|');
            return res.status(409).json({
                success: false,
                error: 'Duplicate record — this file hash already exists on the chain.',
                data_hash: dupHash
            });
        }

        // Unexpected output from core
        return res.status(500).json({
            success: false,
            error: `Core returned unexpected output: ${trimmed}`
        });

    } catch (error) {
        // Clean up copied file on error
        fs.unlink(destPath, () => {});
        return res.status(500).json({ error: error.toString() });
    }
};

const verifyRecord = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded for verification' });
    }

    try {
        // Call C core: VERIFY_FILE <abs_path>
        const output = await runCoreCommand('VERIFY_FILE', [file.path]);

        // Clean up temp file
        fs.unlink(file.path, () => {});

        const trimmed = (output || '').trim();

        if (trimmed.startsWith('MATCH|')) {
            // MATCH|block_index|tx_index|hash|pointer|patient_id|doctor_id
            const [, blockIndex, txIndex, dataHash, dataPointer, patientId, doctorId] = trimmed.split('|');
            return res.json({
                valid: true,
                message: 'File matches blockchain record. Integrity confirmed.',
                block_index: parseInt(blockIndex, 10),
                tx_index: parseInt(txIndex, 10),
                data_hash: dataHash,
                data_pointer: dataPointer,
                patient_id: patientId,
                doctor_id: doctorId
            });
        }

        if (trimmed.startsWith('NOT_FOUND|')) {
            const [, computedHash] = trimmed.split('|');
            return res.json({
                valid: false,
                message: 'No matching record found on the blockchain. File may be tampered or was never registered.',
                computed_hash: computedHash
            });
        }

        return res.status(500).json({
            valid: false,
            error: `Core returned unexpected output: ${trimmed}`
        });

    } catch (error) {
        fs.unlink(file.path, () => {});
        return res.status(500).json({ error: error.toString() });
    }
};

module.exports = { uploadRecord, verifyRecord };
