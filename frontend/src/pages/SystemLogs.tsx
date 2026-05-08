import React from 'react';
import { Terminal, AlertCircle, Info, ShieldAlert } from 'lucide-react';

const SystemLogs: React.FC = () => {
  const systemLogs = [
    { id: 1, level: 'INFO', msg: 'P2P Handshake successful with peer :8002', time: '10:45:22', type: 'network' },
    { id: 2, level: 'WARN', msg: 'Rate limit threshold reached for peer :8005', time: '10:42:10', type: 'security' },
    { id: 3, level: 'ERROR', msg: 'Invalid signature on block #142 from unauthorized node', time: '10:38:05', type: 'consensus' },
    { id: 4, level: 'INFO', msg: 'New block appended to local ledger. Current height: 143', time: '10:30:15', type: 'storage' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="text-slate-800" size={24} />
            System Console
          </h2>
          <p className="text-slate-500">Real-time infrastructure and security alerts</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs">Clear Logs</button>
          <button className="btn-primary text-xs">Export to CSV</button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="px-6 py-3 bg-slate-800 flex items-center gap-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">node_v1.0.4_terminal</span>
        </div>
        
        <div className="p-4 font-mono text-xs space-y-2 max-h-[500px] overflow-auto">
          {systemLogs.map(log => (
            <div key={log.id} className="flex gap-4 group">
              <span className="text-slate-600 shrink-0">[{log.time}]</span>
              <span className={`font-bold shrink-0 ${
                log.level === 'ERROR' ? 'text-red-400' : 
                log.level === 'WARN' ? 'text-amber-400' : 'text-blue-400'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-300 group-hover:text-white transition-colors">{log.msg}</span>
              <span className="text-[10px] text-slate-600 uppercase font-bold ml-auto">{log.type}</span>
            </div>
          ))}
          <div className="flex gap-4 animate-pulse">
            <span className="text-slate-600">[_:__:__]</span>
            <span className="text-slate-600">SYSTEM</span>
            <span className="text-slate-600">Waiting for next event...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
