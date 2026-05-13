const net = require('net');
const fs = require('fs');
const path = require('path');
const { logEvent } = require('../utils/logger');

const pingPort = (port) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        socket.setTimeout(1000);
        
        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', () => {
            resolve(false);
        });
        
        socket.connect(port, '127.0.0.1');
    });
};

const getNetworkHealth = async (req, res) => {
    try {
        logEvent('INFO', 'Network health check initiated');
        const startPort = 8001;
        const endPort = 8010;
        const portRange = Array.from({ length: endPort - startPort + 1 }, (_, i) => startPort + i);

        // Scan all ports in parallel for maximum speed
        const scanResults = await Promise.all(
            portRange.map(async (port) => {
                const start = Date.now();
                const isOnline = await pingPort(port);
                if (!isOnline) return null;

                return {
                    port,
                    type: port === 8001 ? 'Primary Validator' : 'Validator Node',
                    status: 'online',
                    latency: `${Date.now() - start}ms`
                };
            })
        );

        const activeNodes = scanResults.filter(n => n !== null);

        // Fallback: If no nodes are online, show at least the primary as offline
        if (activeNodes.length === 0) {
            activeNodes.push({
                port: 8001,
                type: 'Primary Validator',
                status: 'offline',
                latency: '-'
            });
        }

        res.json({ nodes: activeNodes });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

const getNetworkLogs = async (req, res) => {
    try {
        const baseDemoPath = path.join(__dirname, '../../../../demo_instances');
        const serverLogPath = path.join(__dirname, '../../server.log');
        
        let allLogs = [];

        // 1. Read Backend Server Logs
        if (fs.existsSync(serverLogPath)) {
            const logs = fs.readFileSync(serverLogPath, 'utf8').split('\n').filter(l => l.trim() !== '');
            allLogs = allLogs.concat(logs);
        }

        // 2. Read logs from all demo nodes (node1, node2, node3, etc.)
        if (fs.existsSync(baseDemoPath)) {
            const nodes = fs.readdirSync(baseDemoPath);
            nodes.forEach(nodeDir => {
                const nodeLogPath = path.join(baseDemoPath, nodeDir, 'data/network.log');
                if (fs.existsSync(nodeLogPath)) {
                    const logs = fs.readFileSync(nodeLogPath, 'utf8')
                        .split('\n')
                        .filter(l => l.trim() !== '')
                        .map(l => `[${nodeDir.toUpperCase()}] ${l}`); // Prefix with node name
                    allLogs = allLogs.concat(logs);
                }
            });
        }

        res.json({ logs: allLogs });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = {
    getNetworkHealth,
    getNetworkLogs
};
