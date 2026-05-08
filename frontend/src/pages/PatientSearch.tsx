import React, { useState } from 'react';
import { Search, User, ExternalLink, Calendar, ChevronRight } from 'lucide-react';

const PatientSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  
  const patients = [
    { id: 'PAT-2025-001', name: 'John Doe', age: 34, lastVisit: '2024-04-12' },
    { id: 'PAT-2025-042', name: 'Jane Smith', age: 28, lastVisit: '2024-05-02' },
    { id: 'PAT-2025-109', name: 'Robert Brown', age: 52, lastVisit: '2024-03-28' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Patient Directory</h2>
        <p className="text-slate-500">Search for patients to view their blockchain-secured history</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Patient ID or Name..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {patients.map(patient => (
          <div key={patient.id} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  {patient.name}
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-mono">{patient.id}</span>
                </h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                  <span>Age: {patient.age}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> Last Visit: {patient.lastVisit}</span>
                </div>
              </div>
            </div>
            
            <button className="flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
              View Records <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-8">
        <button className="btn-secondary text-sm">
          Load More Patients
        </button>
      </div>
    </div>
  );
};

export default PatientSearch;
