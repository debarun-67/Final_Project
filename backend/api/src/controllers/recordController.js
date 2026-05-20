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
        // Encrypt the uploaded file into the node's offchain/records
        const encryptOutput = await runCoreCommand('ENCRYPT', [
            file.path,
            destPath,
            patient_id,
            doctor_id
        ]);

        if (!encryptOutput || !encryptOutput.includes('ENCRYPT_SUCCESS')) {
            fs.unlink(file.path, () => {});
            return res.status(500).json({ error: 'Encryption failed on the core backend.' });
        }

        // Call C core: ADD <abs_source_path> <data_pointer> <patient_id> <doctor_id> <port>
        // Note: we use file.path (plaintext) so the blockchain records the hash of the original plaintext file,
        // while using dataPointer (encrypted path) as the reference for where the encrypted record is stored off-chain.
        const output = await runCoreCommand('ADD', [
            file.path,
            dataPointer,
            patient_id,
            doctor_id,
            String(VALIDATOR_PORT)
        ]);

        // Clean up the temp multer file now that it has been hashed by C core
        fs.unlink(file.path, () => {});

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
        // Clean up copied files on error
        fs.unlink(destPath, () => {});
        fs.unlink(file.path, () => {});
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
        const lines = trimmed.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        const firstLine = lines[0] || '';

        if (firstLine.startsWith('MATCH|')) {
            // MATCH|block_index|tx_index|hash|pointer|patient_id|doctor_id
            const [, blockIndex, txIndex, dataHash, dataPointer, patientId, doctorId] = firstLine.split('|');
            const headerLine = lines.find(line => line.startsWith('HEADER|'));
            const txMetaLine = lines.find(line => line.startsWith('TX_META|'));
            const proofLine = lines.find(line => line.startsWith('PROOF|'));
            const proofSteps = lines
                .filter(line => line.startsWith('PROOF_STEP|'))
                .map(line => {
                    const [, position, hash] = line.split('|');
                    return { position, hash };
                });

            let blockHeader = null;
            if (headerLine) {
                const [, hIndex, timestamp, previousHash, merkleRoot, blockHash, validatorPort, validatorSignature] = headerLine.split('|');
                blockHeader = {
                    index: parseInt(hIndex, 10),
                    timestamp: parseInt(timestamp, 10),
                    previous_hash: previousHash,
                    merkle_root: merkleRoot,
                    block_hash: blockHash,
                    validator_port: parseInt(validatorPort, 10),
                    validator_signature: validatorSignature
                };
            }

            let transaction = null;
            if (txMetaLine) {
                const [, patient, doctor, pointer, timestamp] = txMetaLine.split('|');
                transaction = {
                    patient_id: patient,
                    doctor_id: doctor,
                    data_hash: dataHash,
                    data_pointer: pointer,
                    timestamp: parseInt(timestamp, 10)
                };
            }

            let merkleProof = null;
            if (proofLine) {
                const [, leafHash, proofLength, computedRoot] = proofLine.split('|');
                merkleProof = {
                    leaf_hash: leafHash,
                    proof_length: parseInt(proofLength, 10),
                    computed_root: computedRoot,
                    siblings: proofSteps
                };
            }

            return res.json({
                valid: true,
                message: 'File matches blockchain record. Merkle proof returned for light-client verification.',
                block_index: parseInt(blockIndex, 10),
                tx_index: parseInt(txIndex, 10),
                data_hash: dataHash,
                data_pointer: dataPointer,
                patient_id: patientId,
                doctor_id: doctorId,
                block_header: blockHeader,
                transaction,
                merkle_proof: merkleProof
            });
        }

        if (firstLine.startsWith('NOT_FOUND|')) {
            const [, computedHash] = firstLine.split('|');
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

const decryptRecord = async (req, res) => {
    const { data_pointer } = req.body;

    if (!data_pointer) {
        return res.status(400).json({ error: 'data_pointer is required for decryption' });
    }

    const userId = req.user.role === 'doctor' ? req.user.doctor_id : req.user.patient_id;

    if (!userId) {
        return res.status(403).json({ error: 'User identity missing for decryption.' });
    }

    // Resolve the actual file path from data_pointer
    // dataPointer usually looks like "offchain/records/filename.enc"
    const fileName = path.basename(data_pointer);
    const sourcePath = path.join(NODE1_OFFCHAIN, fileName);
    const destPath = `${sourcePath}.dec`;

    if (!fs.existsSync(sourcePath)) {
        return res.status(404).json({ error: 'Encrypted record not found on the server.' });
    }

    try {
        // Call C core: DECRYPT <abs_source_path> <abs_dest_path> <user_key>
        const output = await runCoreCommand('DECRYPT', [
            sourcePath,
            destPath,
            userId
        ]);

        if (!output || !output.includes('DECRYPT_SUCCESS')) {
            return res.status(403).json({ error: 'Decryption failed. Unauthorized or corrupted envelope.' });
        }

        // Return the decrypted file to the user
        res.download(destPath, 'decrypted_record.txt', (err) => {
            // Clean up decrypted temp file after sending
            fs.unlink(destPath, () => {});
        });

    } catch (error) {
        fs.unlink(destPath, () => {});
        return res.status(500).json({ error: error.toString() });
    }
};

module.exports = { uploadRecord, verifyRecord, decryptRecord };
