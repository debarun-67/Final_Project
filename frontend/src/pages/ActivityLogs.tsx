import React, { useState, useEffect } from 'react';
import { History, Shield, FilePlus } from 'lucide-react';
import { blockchainService } from '../services/api';

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data: blocks } = await blockchainService.getBlocks();
        
        const allLogs: any[] = [];
        
        // Convert blocks and transactions to audit events
        blocks.forEach((block: any) => {
          // Add block event
          allLogs.push({
            id: `block-${block.index}`,
            action: 'BLOCK_SIGNED',
            target: `Block #${block.index}`,
            time: new Date(block.timestamp * 1000).toLocaleString(),
            timestamp: block.timestamp,
            status: 'SUCCESS'
          });

          // Add transaction events
          if (block.transactions && Array.isArray(block.transactions)) {
            block.transactions.forEach((tx: any, txIndex: number) => {
              allLogs.push({
                id: `tx-${block.index}-${txIndex}`,
                action: 'RECORD_UPLOAD',
                target: tx.patient_id,
                time: new Date(tx.timestamp * 1000).toLocaleString(),
                timestamp: tx.timestamp,
                status: 'SUCCESS'
              });
            });
          }
        });

        // Sort descending by timestamp
        allLogs.sort((a, b) => b.timestamp - a.timestamp);

        setLogs(allLogs);
      } catch (err) {
        console.error('Failed to fetch activity logs:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <History className="text-blue-600" size={24} />
          Audit Trail
        </h2>
        <p className="text-black">Immutable history of all actions performed within the system</p>
      </div>

      {loading ? (
        <div className="text-center p-8 text-slate-500">Syncing audit trail from blockchain...</div>
      ) : logs.length === 0 ? (
        <div className="text-center p-8 text-slate-500 glass-card">No activity recorded on the network.</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-black">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Event</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Target ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-white/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-none">
                        {log.action.includes('RECORD') ? <FilePlus size={16} /> : <Shield size={16} />}
                      </div>
                      <span className="text-sm font-bold text-black">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-black">{log.target}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">{log.time}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-none">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
