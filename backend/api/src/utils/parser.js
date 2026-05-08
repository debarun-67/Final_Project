/**
 * Parses the raw text output from the C blockchain core into JSON
 * @param {string} text Raw output from the C binary
 * @returns {object|array} Parsed data
 */
const parseBlockOutput = (text) => {
    const blocks = [];
    const blockRegex = /\[BLOCK\] Index: (\d+)\n\[BLOCK\] Timestamp: (\d+)\n\[BLOCK\] Previous Hash: (\w+)\n\[BLOCK\] Block Hash: (\w+)\n\[BLOCK\] Merkle Root: (\w+)\n\[BLOCK\] Validator Port: (\d+)\n\[BLOCK\] Transactions: (\d+)/g;
    
    let match;
    while ((match = blockRegex.exec(text)) !== null) {
        const block = {
            index: parseInt(match[1]),
            timestamp: parseInt(match[2]),
            previous_hash: match[3],
            block_hash: match[4],
            merkle_root: match[5],
            validator_port: parseInt(match[6]),
            transaction_count: parseInt(match[7]),
            transactions: []
        };
        
        // Extract transactions for this block
        const startIdx = match.index;
        const nextBlockMatch = blockRegex.exec(text);
        const endIdx = nextBlockMatch ? nextBlockMatch.index : text.length;
        blockRegex.lastIndex = match.index + match[0].length; // Reset for next iteration correctly
        
        const blockText = text.substring(startIdx, endIdx);
        const txRegex = /\[TX \d+\]\n\s+Patient ID: ([\w-]+)\n\s+Doctor ID: ([\w-]+)\n\s+Data Hash: (\w+)\n\s+File Path: ([\w\/\.-]+)\n\s+Timestamp: (\d+)/g;
        
        let txMatch;
        while ((txMatch = txRegex.exec(blockText)) !== null) {
            block.transactions.push({
                patient_id: txMatch[1],
                doctor_id: txMatch[2],
                data_hash: txMatch[3],
                data_pointer: txMatch[4],
                timestamp: parseInt(txMatch[5])
            });
        }
        
        blocks.push(block);
        if (!nextBlockMatch) break;
    }
    
    return blocks;
};

module.exports = { parseBlockOutput };
