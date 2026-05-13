const net = require('net');

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
        const nodes = [
            { port: 8001, type: 'Primary Validator' },
            { port: 8002, type: 'Backup Node' },
            { port: 8003, type: 'Auditor Node' },
        ];

        const healthStatus = await Promise.all(
            nodes.map(async (node) => {
                const start = Date.now();
                const isOnline = await pingPort(node.port);
                const latency = isOnline ? `${Date.now() - start}ms` : '-';
                
                return {
                    ...node,
                    status: isOnline ? 'online' : 'offline',
                    latency
                };
            })
        );

        res.json({ nodes: healthStatus });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

module.exports = { getNetworkHealth };
