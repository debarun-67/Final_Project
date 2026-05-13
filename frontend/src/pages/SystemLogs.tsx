import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { blockchainService } from '../services/api';

const SystemLogs: React.FC = () => {
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [blocksRes, healthRes, logsRes] = await Promise.all([
          blockchainService.getBlocks(),
          blockchainService.getNetworkHealth(),
          blockchainService.getNetworkLogs()
        ]);
        
        const logs: any[] = [];
        let idCounter = 1;

        // 1. Add Real Network & System Logs
        if (logsRes.data && logsRes.data.logs) {
          logsRes.data.logs.forEach((logStr: string) => {
            // Updated regex: Optional prefix [NODE1] followed by [Timestamp] Message
            const match = logStr.match(/^(?:\[(NODE\d+)\] )?\[(.*?)\] (.*)/);
            if (match) {
              const nodePrefix = match[1]; // e.g. "NODE1"
              const rawTime = match[2];
              let msg = nodePrefix ? `(${nodePrefix}) ${match[3]}` : match[3];
              
              // Clean up "INFO: " or "WARN: " prefixes if they exist in the message part
              let level: 'INFO' | 'WARN' | 'ERROR' = 'INFO';
              if (msg.startsWith('INFO:')) {
                level = 'INFO';
                msg = msg.replace('INFO:', '').trim();
              } else if (msg.startsWith('WARN:')) {
                level = 'WARN';
                msg = msg.replace('WARN:', '').trim();
              } else if (msg.startsWith('ERROR:')) {
                level = 'ERROR';
                msg = msg.replace('ERROR:', '').trim();
              } else if (logStr.toLowerCase().includes('disconnected')) {
                level = 'WARN';
              }

              let dateObj = new Date(rawTime);
              if (isNaN(dateObj.getTime())) dateObj = new Date();

              logs.push({
                id: idCounter++,
                level: level,
                msg: msg,
                time: dateObj.toLocaleTimeString(),
                timestamp: dateObj.getTime(),
                type: logStr.includes('API') || logStr.includes('Client') ? 'system' : 'network'
              });
            }
          });
        }

        // 2. Fallback: Add UI-generated health status if file is empty
        if (logs.length === 0 && healthRes.data && healthRes.data.nodes) {
          healthRes.data.nodes.forEach((node: any) => {
            if (node.status === 'online') {
              logs.push({
                id: idCounter++,
                level: 'INFO',
                msg: `Node detected on port :${node.port}`,
                time: new Date().toLocaleTimeString(),
                timestamp: Date.now(),
                type: 'network'
              });
            }
          });
        }

        // 3. Add Blockchain Storage Logs
        if (blocksRes.data && Array.isArray(blocksRes.data)) {
          blocksRes.data.forEach((block: any) => {
            logs.push({
              id: idCounter++,
              level: 'INFO',
              msg: `Ledger Update: Block #${block.index} synchronized. Hash: ${block.block_hash.substring(0, 12)}...`,
              time: new Date(block.timestamp * 1000).toLocaleTimeString(),
              timestamp: block.timestamp * 1000,
              type: 'storage'
            });
          });
        }

        // Sort descending by timestamp
        logs.sort((a, b) => b.timestamp - a.timestamp);
        
        setSystemLogs(logs.slice(0, 50)); // Keep last 50
      } catch (err) {
        console.error('Failed to fetch system logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemData();
    const interval = setInterval(fetchSystemData, 5000);
    return () => clearInterval(interval);
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
