import React from 'react';
import { History, Shield, User, FilePlus } from 'lucide-react';

const ActivityLogs: React.FC = () => {
  const logs = [
    { id: 1, action: 'RECORD_UPLOAD', target: 'PAT-2025-001', time: '2 mins ago', status: 'SUCCESS' },
    { id: 2, action: 'BLOCK_SIGNED', target: 'Block #142', time: '15 mins ago', status: 'SUCCESS' },
    { id: 3, action: 'VERIFICATION_CHECK', target: 'PAT-2025-042', time: '1 hour ago', status: 'SUCCESS' },
    { id: 4, action: 'KEY_ROTATION', target: 'Validator_8001', time: '4 hours ago', status: 'SUCCESS' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <History className="text-blue-600" size={24} />
          Audit Trail
        </h2>
        <p className="text-slate-500">Immutable history of all actions performed within the system</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Event</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Target ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      {log.action.includes('RECORD') ? <FilePlus size={16} /> : <Shield size={16} />}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{log.action}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{log.target}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{log.time}</td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;
