import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabase';

const PatientSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetch all profiles that have the patient role
        const { data, error } = await supabase
          .from('profiles')
          .select('id, patient_id, created_at')
          .eq('role', 'patient');
          
        if (error) throw error;
        
        // Fetch emails from admin api if possible, or just use the ID. 
        // Since we can't query auth.users from frontend easily due to RLS, 
        // we will display the patient_id as the primary identifier.
        const formattedPatients = data?.map(p => ({
          id: p.patient_id || p.id.substring(0, 8),
          name: 'Registered Patient', // Generic name since PII shouldn't be public
          age: '-', // Placeholder since we don't store age yet
          lastVisit: new Date(p.created_at).toLocaleDateString()
        })) || [];
        
        setPatients(formattedPatients);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.id.toLowerCase().includes(query.toLowerCase()) || 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Patient Directory</h2>
        <p className="text-black">Search for patients to view their blockchain-secured history</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter Patient ID or Name..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-black rounded-none outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center p-8 text-slate-500">Loading patients from database...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-black">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-none flex items-center justify-center text-black group-hover:bg-blue-50 group-hover:text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-black flex items-center gap-2">
                    {patient.name}
                    <span className="px-2 py-0.5 bg-white text-black rounded-none text-[10px] font-mono">{patient.id}</span>
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span>Age: {patient.age}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Last Visit: {patient.lastVisit}</span>
                  </div>
                </div>
              </div>
              
              <button className="flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100">
                View Records <ChevronRight size={16} />
              </button>
            </div>
          ))}
          
          {filteredPatients.length === 0 && (
            <div className="text-center p-8 text-slate-500 bg-white">
              No patients found matching your search.
            </div>
          )}
        </div>
      )}
      
      <div className="text-center pt-8">
        <button className="btn-secondary text-sm" disabled={loading}>
          Load More Patients
        </button>
      </div>
    </div>
  );
};

export default PatientSearch;
