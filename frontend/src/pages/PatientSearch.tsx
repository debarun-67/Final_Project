import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, ChevronRight, X, FileText, Download, ShieldCheck } from 'lucide-react';
import { blockchainService, recordService } from '../services/api';
import type { Block, Transaction } from '../types/blockchain';

interface PatientSummary {
  id: string;
  name: string;
  age: string;
  lastVisit: string;
}

interface MedicalRecord {
  id: string;
  name: string;
  date: string;
  doctor: string;
  patient_id: string;
  status: 'verified';
  data_pointer: string;
}

const PatientSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [allRecords, setAllRecords] = useState<MedicalRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [decryptingId, setDecryptingId] = useState<string | null>(null);

  const fetchPatientsAndRecords = async () => {
    try {
      setLoading(true);
      
      // 1. Setup local mock patients
      const mockPatients: PatientSummary[] = [
        {
          id: 'PAT_001',
          name: 'John Doe',
          age: '32',
          lastVisit: new Date().toLocaleDateString()
        },
        {
          id: 'PAT_002',
          name: 'Jane Doe',
          age: '28',
          lastVisit: new Date().toLocaleDateString()
        }
      ];

      // 2. Fetch blockchain transactions to discover all patients and their records
      let chainRecords: MedicalRecord[] = [];
      try {
        const { data: blocks } = await blockchainService.getBlocks();
        if (blocks && Array.isArray(blocks)) {
          blocks.forEach((block: Block) => {
            if (block.transactions && Array.isArray(block.transactions)) {
              block.transactions.forEach((tx: Transaction) => {
                if (tx.patient_id && tx.patient_id !== 'GENESIS') {
                  chainRecords.push({
                    id: tx.data_hash || Math.random().toString(),
                    name: 'Encrypted Medical Record',
                    date: new Date(tx.timestamp * 1000).toLocaleDateString(),
                    doctor: tx.doctor_id,
                    patient_id: tx.patient_id,
                    status: 'verified',
                    data_pointer: tx.data_pointer
                  });
                }
              });
            }
          });
        }
      } catch (chainErr) {
        console.error('Failed to load blocks:', chainErr);
      }

      setAllRecords(chainRecords);

      // 3. Extract unique patient IDs from blockchain
      const chainPatientIds = Array.from(new Set(chainRecords.map(r => r.patient_id.trim())));

      // 4. Merge mock and blockchain patient lists
      const mergedPatientsMap = new Map<string, PatientSummary>();

      // Seed with mock profiles
      mockPatients.forEach(p => {
        mergedPatientsMap.set(p.id.toLowerCase(), p);
      });

      // Add any missing blockchain patients
      chainPatientIds.forEach(pid => {
        const key = pid.toLowerCase();
        if (!mergedPatientsMap.has(key)) {
          // Find last visit date from records
          const patientRecords = chainRecords.filter(r => r.patient_id.trim().toLowerCase() === key);
          const lastVisitDate = patientRecords.length > 0 ? patientRecords[0].date : new Date().toLocaleDateString();
          
          mergedPatientsMap.set(key, {
            id: pid,
            name: key.includes('pat_001') ? 'John Doe' : key.includes('pat_002') ? 'Jane Doe' : `Registered Patient`,
            age: '-',
            lastVisit: lastVisitDate
          });
        }
      });

      setPatients(Array.from(mergedPatientsMap.values()));
    } catch (err) {
      console.error('Unified Patient load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsAndRecords();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.id.toLowerCase().includes(query.toLowerCase()) || 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectedPatientRecords = selectedPatient
    ? allRecords.filter(r => r.patient_id.trim().toLowerCase() === selectedPatient.id.trim().toLowerCase())
    : [];

  const handleDecrypt = async (recordId: string, dataPointer: string) => {
    try {
      setDecryptingId(recordId);
      const response = await recordService.decrypt(dataPointer);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `decrypted_record_${selectedPatient?.id || 'patient'}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert('Failed to decrypt record. You may not be authorized to view this patient\'s records.');
      console.error(err);
    } finally {
      setDecryptingId(null);
    }
  };

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
        <div className="text-center p-8 text-slate-500">Loading patients from database and blockchain...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map(patient => (
            <div 
              key={patient.id} 
              onClick={() => setSelectedPatient(patient)}
              className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-black hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-none flex items-center justify-center text-black border border-black group-hover:bg-black group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-black flex items-center gap-2">
                    {patient.name}
                    <span className="px-2 py-0.5 bg-slate-100 text-black rounded-none text-[10px] font-mono border border-black/10">{patient.id}</span>
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span>Age: {patient.age}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Last Visit: {patient.lastVisit}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}
                className="flex items-center gap-2 text-sm font-bold text-black hover:underline"
              >
                View Records <ChevronRight size={16} />
              </button>
            </div>
          ))}
          
          {filteredPatients.length === 0 && (
            <div className="text-center p-8 text-slate-500 bg-white border border-black">
              No patients found matching your search.
            </div>
          )}
        </div>
      )}
      
      <div className="text-center pt-8">
        <button 
          onClick={fetchPatientsAndRecords}
          className="btn-secondary text-sm" 
          disabled={loading}
        >
          Refresh Directory
        </button>
      </div>

      {/* Modern sliding-over drawer modal for patient records */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 animate-in fade-in duration-200">
          <div className="h-full w-full max-w-2xl bg-white border-l border-black p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-start pb-4 border-b border-black">
                <div>
                  <h3 className="text-xl font-bold text-black">{selectedPatient.name}</h3>
                  <p className="text-sm font-mono text-slate-500 mt-1">Patient ID: {selectedPatient.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="p-1 hover:bg-slate-100 border border-black rounded-none"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Medical History on Blockchain</h4>
                
                {selectedPatientRecords.length === 0 ? (
                  <div className="text-center p-8 text-slate-400 border border-dashed border-black">
                    No medical records found on the blockchain for this patient.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedPatientRecords.map(record => (
                      <div key={record.id} className="glass-card p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-100 border border-black/10 text-black">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h5 className="font-bold text-black text-sm">{record.name}</h5>
                            <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1"><Calendar size={10} /> {record.date}</span>
                              <span className="flex items-center gap-1"><User size={10} /> Doctor: {record.doctor}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="px-2.5 py-0.5 border border-emerald-500 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            {record.status}
                          </span>
                          <button 
                            disabled={decryptingId !== null}
                            onClick={() => handleDecrypt(record.id, record.data_pointer)}
                            className="p-2 text-black border border-black hover:bg-black hover:text-white transition-colors"
                            title="Decrypt & Download Record"
                          >
                            {decryptingId === record.id ? (
                              <span className="text-xs font-bold animate-pulse">Decrypting...</span>
                            ) : (
                              <Download size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-black flex justify-end">
              <button 
                onClick={() => setSelectedPatient(null)}
                className="btn-secondary"
              >
                Close Directory Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
