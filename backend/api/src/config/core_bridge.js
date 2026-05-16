const { execFile } = require('child_process');
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
        const binary = process.platform === 'win32' ? 'viewer.exe' : './viewer';
        const fullPath = path.resolve(CORE_BIN_PATH, binary);
        const LIVE_NODE_PATH = path.resolve(__dirname, '../../../../demo_instances/node1');
        const CENTRAL_DATA_PATH = path.resolve(__dirname, '../../../core');
        const cmdParts = String(cmd).trim().split(/\s+/).filter(Boolean);
        const commandArgs = [...cmdParts, ...args.map(String)];

        execFile(fullPath, commandArgs, { cwd: LIVE_NODE_PATH }, (error, stdout) => {
            if (error) {
                if (stdout && stdout.trim()) {
                    resolve(stdout);
                    return;
                }

                console.warn(`[BRIDGE] Demo node execution failed at ${LIVE_NODE_PATH}. Falling back...`);

                execFile(fullPath, commandArgs, { cwd: CENTRAL_DATA_PATH }, (err2, out2) => {
                    if (err2) {
                        const output = out2 || stdout || "";
                        if (output.trim()) {
                            resolve(output);
                            return;
                        }
                        console.error(`[BRIDGE FATAL] Failed to execute ${fullPath} ${commandArgs.join(' ')}`);
                        reject(err2);
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
