/**
 * Parses the raw text output from the C blockchain core into JSON
 * @param {string} text Raw output from the C binary
 * @returns {object|array} Parsed data
 */
const parseBlockOutput = (text) => {
    if (!text || text.trim() === "") return [];
    
    const blocks = [];
    const blockSections = text.split("---END_BLOCK---");

    blockSections.forEach(section => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return;

        const lines = trimmedSection.split(/\r?\n/);
        const block = {
            transactions: []
        };

        lines.forEach(line => {
            const [key, value] = line.split("|");
            if (!key || !value) return;

            switch (key.trim()) {
                case "INDEX": block.index = parseInt(value); break;
                case "TIMESTAMP": block.timestamp = parseInt(value); break;
                case "PREV_HASH": block.previous_hash = value.trim(); break;
                case "BLOCK_HASH": block.block_hash = value.trim(); break;
                case "MERKLE": block.merkle_root = value.trim(); break;
                case "VALIDATOR": block.validator_port = parseInt(value); break;
                case "SIGNATURE": block.validator_signature = value.trim(); break;
                case "TX_COUNT": block.transaction_count = parseInt(value); break;
                case "TX":
                    const txParts = line.split("|");
                    // TX|patient_id|doctor_id|data_hash|data_pointer|timestamp
                    if (txParts.length >= 6) {
                        block.transactions.push({
                            patient_id: txParts[1],
                            doctor_id: txParts[2],
                            data_hash: txParts[3],
                            data_pointer: txParts[4],
                            timestamp: parseInt(txParts[5])
                        });
                    }
                    break;
            }
        });

        if (block.index !== undefined) {
            blocks.push(block);
        }
    });

    return blocks;
};

module.exports = { parseBlockOutput };
