import React from 'react';
import { FileText, Download, ShieldCheck, Clock, User } from 'lucide-react';

const MyRecords: React.FC = () => {
  // Mock data for UI demo
  const records = [
    { id: '1', name: 'Blood Test Report', date: '2024-05-01', doctor: 'Dr. Smith', status: 'verified' },
    { id: '2', name: 'X-Ray Chest', date: '2024-04-15', doctor: 'Dr. Jones', status: 'verified' },
    { id: '3', name: 'MRI Scan', date: '2024-03-20', doctor: 'Dr. Williams', status: 'pending' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Medical Records</h2>
          <p className="text-slate-500">Access and verify your blockchain-secured medical history</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={18} />
          <span className="text-sm font-bold text-blue-700">Total: {records.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {records.map(record => (
          <div key={record.id} className="glass-card p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{record.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {record.date}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <User size={12} /> {record.doctor}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                record.status === 'verified' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {record.status}
              </span>
              
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Download">
                  <Download size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Verify">
                  <ShieldCheck size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecords;
