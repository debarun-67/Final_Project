import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { blockchainService } from '../services/api';

const SystemLogs: React.FC = () => {
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [blocksRes, healthRes] = await Promise.all([
          blockchainService.getBlocks(),
          blockchainService.getNetworkHealth()
        ]);
        
        const logs: any[] = [];
        let idCounter = 1;

        // Generate Network Logs
        if (healthRes.data && healthRes.data.nodes) {
          healthRes.data.nodes.forEach((node: any) => {
            if (node.status === 'online') {
              logs.push({
                id: idCounter++,
                level: 'INFO',
                msg: `P2P Handshake successful with peer :${node.port} (${node.latency})`,
                time: new Date().toLocaleTimeString(),
                timestamp: Date.now(),
                type: 'network'
              });
            } else {
              logs.push({
                id: idCounter++,
                level: 'WARN',
                msg: `Peer :${node.port} is unreachable. Status: offline`,
                time: new Date().toLocaleTimeString(),
                timestamp: Date.now() - 1000,
                type: 'network'
              });
            }
          });
        }

        // Generate Blockchain Logs
        if (blocksRes.data && Array.isArray(blocksRes.data)) {
          blocksRes.data.slice(0, 10).forEach((block: any) => {
            logs.push({
              id: idCounter++,
              level: 'INFO',
              msg: `New block appended to local ledger. Hash: ${block.block_hash.substring(0, 16)}...`,
              time: new Date(block.timestamp * 1000).toLocaleTimeString(),
              timestamp: block.timestamp * 1000,
              type: 'storage'
            });

            if (block.transactions && block.transactions.length > 0) {
              logs.push({
                id: idCounter++,
                level: 'INFO',
                msg: `Validated ${block.transactions.length} transaction(s) in Block #${block.index}`,
                time: new Date((block.timestamp + 1) * 1000).toLocaleTimeString(),
                timestamp: (block.timestamp + 1) * 1000,
                type: 'consensus'
              });
            }
          });
        }

        // Sort descending
        logs.sort((a, b) => b.timestamp - a.timestamp);
        
        setSystemLogs(logs);
      } catch (err) {
        console.error('Failed to fetch system logs:', err);
        setSystemLogs([{
          id: 1, level: 'ERROR', msg: 'Failed to connect to backend validator node.', time: new Date().toLocaleTimeString(), type: 'system'
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Terminal className="text-black" size={24} />
            System Console
          </h2>
          <p className="text-black">Real-time infrastructure and security alerts</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs">Clear Logs</button>
          <button className="btn-primary text-xs">Export to CSV</button>
        </div>
      </div>

      <div className="bg-white rounded-none overflow-hidden border border-slate-800">
        <div className="px-6 py-3 bg-white flex items-center gap-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-none bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-none bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-none bg-emerald-500" />
          </div>
          <span className="text-[10px] font-bold text-black uppercase tracking-widest ml-2">node_v1.0.4_terminal</span>
        </div>
        
        <div className="p-4 font-mono text-xs space-y-2 max-h-[500px] overflow-auto">
          {loading ? (
            <div className="text-slate-500">Connecting to node streams...</div>
          ) : systemLogs.length === 0 ? (
            <div className="text-slate-500">No logs available.</div>
          ) : (
            <>
              {systemLogs.map(log => (
                <div key={log.id} className="flex gap-4 group">
                  <span className="text-black shrink-0">[{log.time}]</span>
                  <span className={`font-bold shrink-0 ${
                    log.level === 'ERROR' ? 'text-red-400' : 
                    log.level === 'WARN' ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-500 group-hover:text-black">{log.msg}</span>
                  <span className="text-[10px] text-black uppercase font-bold ml-auto">{log.type}</span>
                </div>
              ))}
            </>
          )}
          <div className="flex gap-4 pt-4 border-t border-slate-800 mt-2">
            <span className="text-black">[_:__:__]</span>
            <span className="text-black">SYSTEM</span>
            <span className="text-black animate-pulse">Waiting for next event...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
