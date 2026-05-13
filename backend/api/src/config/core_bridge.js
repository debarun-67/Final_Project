const { exec } = require('child_process');
const path = require('path');

// Paths to C binaries
const CORE_BIN_PATH = path.join(__dirname, '../../../core/bin');

/**
 * Runs a command on the C blockchain core
 * @param {string} cmd The command to run (e.g., "HEIGHT", "LAST", "PRINT 0")
 * @param {string[]} args Additional arguments for the binary
 * @returns {Promise<string>} Output from the command
 */
const runCoreCommand = (cmd, args = []) => {
    return new Promise((resolve, reject) => {
        // Use viewer or blockchain depending on command
        // For now, let's assume we use the 'viewer' or a specialized CLI tool
        const binary = process.platform === 'win32' ? 'viewer.exe' : './viewer';
        const fullPath = path.resolve(CORE_BIN_PATH, binary);
        
        // POINT TO THE LIVE DEMO INSTANCE (Node 1)
        const LIVE_NODE_PATH = path.resolve(__dirname, '../../../../demo_instances/node1');
        
        const fullCmd = `"${fullPath}" ${cmd} ${args.join(' ')}`;
        
        exec(fullCmd, { cwd: LIVE_NODE_PATH }, (error, stdout, stderr) => {
            if (error) {
                console.warn(`[BRIDGE] Demo node execution failed at ${LIVE_NODE_PATH}. Falling back...`);
                const CENTRAL_DATA_PATH = path.resolve(__dirname, '../../../core/data');
                
                exec(fullCmd, { cwd: CENTRAL_DATA_PATH }, (err2, out2, stderr2) => {
                    if (err2) {
                        console.error(`[BRIDGE FATAL] Failed to execute: ${fullCmd}`);
                        resolve("");
                    }
                    else resolve(out2);
                });
                return;
            }
            resolve(stdout);
        });
    });
};

module.exports = { runCoreCommand };
