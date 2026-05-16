import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldCheck, Clock, User } from 'lucide-react';
import { blockchainService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import type { Block, Transaction } from '../types/blockchain';

interface MedicalRecord {
  id: string;
  name: string;
  date: string;
  doctor: string;
  patient_id: string;
  status: 'verified';
  data_pointer: string;
}

const MyRecords: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data: blocks } = await blockchainService.getBlocks();
        
        let allTransactions: MedicalRecord[] = [];
        
        // Parse blocks and extract transactions
        blocks.forEach((block: Block) => {
          if (block.transactions && Array.isArray(block.transactions)) {
            block.transactions.forEach((tx: Transaction) => {
              allTransactions.push({
                id: tx.data_hash || Math.random().toString(),
                name: 'Encrypted Medical Record',
                date: new Date(tx.timestamp * 1000).toLocaleDateString(),
                doctor: tx.doctor_id,
                patient_id: tx.patient_id,
                status: 'verified', // All transactions on the blockchain are verified
                data_pointer: tx.data_pointer
              });
            });
          }
        });

        // If the user is a patient, only show their records
        // If the user is an admin, show all records
        if (user?.role === 'patient' && user?.patient_id) {
          allTransactions = allTransactions.filter(tx => tx.patient_id === user.patient_id);
        }

        setRecords(allTransactions);
      } catch (err) {
        console.error('Failed to fetch records:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchRecords();
    }
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-black">My Medical Records</h2>
          <p className="text-black">Access and verify your blockchain-secured medical history</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-none border border-black flex items-center gap-2">
          <ShieldCheck className="text-blue-600" size={18} />
          <span className="text-sm font-bold text-blue-700">Total: {records.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-8 text-slate-500">Decrypting and loading records from blockchain...</div>
      ) : records.length === 0 ? (
        <div className="text-center p-8 text-slate-500 glass-card">No medical records found on the blockchain.</div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div key={record.id} className="glass-card p-4 flex items-center justify-between hover:bg-white group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-none">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-black group-hover:text-blue-600">{record.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {record.date}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <User size={12} /> {record.doctor}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {record.patient_id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className={`px-2.5 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                  record.status === 'verified' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {record.status}
                </span>
                
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-none" title="Download">
                    <Download size={20} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-none" title="Verify Integrity">
                    <ShieldCheck size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecords;
