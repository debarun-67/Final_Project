import React, { useState } from 'react';
import { recordService } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, Key } from 'lucide-react';

const UploadRecord: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('record', file);
    formData.append('patient_id', patientId);
    formData.append('doctor_id', doctorId);
    formData.append('password', password);

    try {
      await recordService.upload(formData);
      setStatus('success');
      setMessage('Record has been encrypted and added to the blockchain successfully.');
      setFile(null);
      setPatientId('');
    } catch (err) {
      setStatus('error');
      setMessage('Failed to upload record. Please check your credentials and try again.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">New Medical Record</h2>
        <p className="text-slate-500">Securely encrypt and anchor a patient record on the ledger</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient ID</label>
              <input 
                type="text" 
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PAT-2025-001"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctor ID</label>
              <input 
                type="text" 
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DOC-MED-45"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encryption Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Master key for this record"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical File</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
              }}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2 text-blue-600">
                  <FileText size={48} />
                  <p className="font-medium">{file.name}</p>
                  <button type="button" onClick={() => setFile(null)} className="text-xs text-slate-400 underline">Remove</button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2">
                  <Upload className="mx-auto text-slate-300" size={48} />
                  <p className="text-slate-500">Drag and drop or <span className="text-blue-600 font-medium">browse</span></p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Maximum file size 10MB</p>
                  <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                </label>
              )}
            </div>
          </div>
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <CheckCircle size={20} />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={status === 'uploading' || !file}
          className="w-full btn-primary h-12 text-lg disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-200"
        >
          {status === 'uploading' ? 'Processing Transaction...' : 'Register Record'}
        </button>
      </form>
    </div>
  );
};

export default UploadRecord;
