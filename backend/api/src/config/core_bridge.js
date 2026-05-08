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
        const fullPath = path.join(CORE_BIN_PATH, binary);
        
        // This is a placeholder logic. In production, we would use a more robust
        // socket-based communication or a better-formatted CLI output.
        exec(`${fullPath} ${cmd} ${args.join(' ')}`, { cwd: path.join(CORE_BIN_PATH, '..') }, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
                return;
            }
            resolve(stdout);
        });
    });
};

module.exports = { runCoreCommand };
