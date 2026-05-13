const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../server.log');

// Overwrite on startup
const initLogger = () => {
    fs.writeFileSync(LOG_FILE, `[${new Date().toISOString()}] API Server Started\n`);
};

const logEvent = (level, message) => {
    const entry = `[${new Date().toISOString()}] ${level}: ${message}\n`;
    fs.appendFileSync(LOG_FILE, entry);
    console.log(entry.trim());
};

module.exports = { initLogger, logEvent, LOG_FILE };
