import React, { useState } from 'react';
import { recordService } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, Key, Hash, Database, User } from 'lucide-react';

interface UploadResult {
  block_index: number;
  data_hash: string;
  data_pointer: string;
  patient_id: string;
  doctor_id: string;
}

const UploadRecord: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error' | 'duplicate'>('idle');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<UploadResult | null>(null);

  const resetForm = () => {
    setFile(null);
    setPatientId('');
    setDoctorId('');
    setPassword('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    setResult(null);

    const formData = new FormData();
    formData.append('record', file);
    formData.append('patient_id', patientId);
    formData.append('doctor_id', doctorId);
    formData.append('password', password);

    try {
      const response = await recordService.upload(formData);
      const data = response.data;
      setStatus('success');
      setResult({
        block_index: data.block_index,
        data_hash: data.data_hash,
        data_pointer: data.data_pointer,
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
      });
      resetForm();
    } catch (err: unknown) {
      const httpErr = err as { response?: { status?: number; data?: { error?: string; data_hash?: string } } };
      const errData = httpErr?.response?.data;
      if (httpErr?.response?.status === 409) {
        setStatus('duplicate');
        setMessage(`Duplicate detected. This file is already on-chain.\nHash: ${errData?.data_hash ?? 'unknown'}`);
      } else {
        setStatus('error');
        setMessage(errData?.error || 'Upload failed. Check backend connection and try again.');
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">New Medical Record</h2>
        <p className="text-black">Securely encrypt and anchor a patient record on the ledger</p>
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
                className="w-full px-4 py-2 bg-white border border-black rounded-none outline-none"
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
                className="w-full px-4 py-2 bg-white border border-black rounded-none outline-none"
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
                className="w-full pl-10 pr-4 py-2 bg-white border border-black rounded-none outline-none"
                placeholder="Master key for this record"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical File</label>
            <div
              className={`border-2 border-dashed rounded-none p-8 text-center ${file ? 'border-black bg-blue-50/30' : 'border-black hover:border-black'}`}
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
                  <p className="text-black">Drag and drop or <span className="text-blue-600 font-medium">browse</span></p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Maximum file size 10MB</p>
                  <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Success — show real blockchain result */}
        {status === 'success' && result && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-none space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle size={20} />
              <span>Record committed to blockchain</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Database size={14} className="text-emerald-600 shrink-0" />
                <span className="font-semibold w-24 shrink-0">Block:</span>
                <span className="font-mono">#{result.block_index}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Hash size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold w-24 shrink-0">SHA-256:</span>
                <span className="font-mono text-xs break-all">{result.data_hash}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <User size={14} className="text-emerald-600 shrink-0" />
                <span className="font-semibold w-24 shrink-0">Patient:</span>
                <span className="font-mono">{result.patient_id}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <User size={14} className="text-emerald-600 shrink-0" />
                <span className="font-semibold w-24 shrink-0">Doctor:</span>
                <span className="font-mono">{result.doctor_id}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Database size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold w-24 shrink-0">Pointer:</span>
                <span className="font-mono text-xs break-all">{result.data_pointer}</span>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate record warning */}
        {status === 'duplicate' && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-700 rounded-none border border-amber-200">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium whitespace-pre-line">{message}</p>
          </div>
        )}

        {/* Generic error */}
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-none border border-red-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'uploading' || !file}
          className="w-full btn-primary h-12 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'uploading' ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing Transaction...
            </>
          ) : 'Register Record'}
        </button>
      </form>
    </div>
  );
};

export default UploadRecord;
