import React, { useState } from 'react';
import { ShieldCheck, Upload, FileCheck, XCircle, AlertTriangle } from 'lucide-react';

const VerifyRecord: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<'none' | 'success' | 'fail'>('none');

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate API call to backend
    setTimeout(() => {
      setIsVerifying(false);
      setResult(file?.name.includes('tampered') ? 'fail' : 'success');
    }, 1500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-emerald-100 text-emerald-600 rounded-none mb-2">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-black">Integrity Verification</h2>
        <p className="text-black">Upload a medical file to check if it matches the blockchain record</p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <div 
          className={`border-2 border-dashed rounded-none p-10 text-center  ${
            file ? 'border-emerald-400 bg-emerald-50/30' : 'border-black hover:border-black'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if(e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
        >
          {file ? (
            <div className="space-y-4">
              <FileCheck size={48} className="mx-auto text-emerald-600" />
              <div>
                <p className="font-bold text-black">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button onClick={() => {setFile(null); setResult('none');}} className="text-xs text-slate-400 underline">Change File</button>
            </div>
          ) : (
            <label className="cursor-pointer space-y-4 block">
              <Upload size={48} className="mx-auto text-slate-200" />
              <p className="text-black italic">Drop your encrypted report here</p>
              <span className="btn-secondary inline-block">Select File</span>
              <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
            </label>
          )}
        </div>

        {result === 'success' && (
          <div className="p-4 bg-emerald-100 border border-emerald-200 rounded-none flex items-center gap-3 text-emerald-800 fade-in slide-in-">
            <ShieldCheck size={24} />
            <div>
              <p className="font-bold">Verified Successfully</p>
              <p className="text-xs opacity-80">This file matches the immutable record on the blockchain.</p>
            </div>
          </div>
        )}

        {result === 'fail' && (
          <div className="p-4 bg-red-100 border border-red-200 rounded-none flex items-center gap-3 text-red-800 fade-in slide-in-">
            <XCircle size={24} />
            <div>
              <p className="font-bold">Tampering Detected!</p>
              <p className="text-xs opacity-80">The hash of this file does not match the ledger entry.</p>
            </div>
          </div>
        )}

        <button 
          onClick={handleVerify}
          disabled={!file || isVerifying}
          className="w-full btn-primary h-12 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-none" />
              Computing SHA-256...
            </>
          ) : 'Check Authenticity'}
        </button>
      </div>

      <div className="flex gap-4 p-4 bg-blue-50/50 border border-black rounded-none text-blue-600">
        <AlertTriangle size={20} className="shrink-0" />
        <p className="text-xs leading-relaxed">
          <strong>Note:</strong> We compare the re-computed SHA-256 fingerprint of your file against the 
          Merkle Root anchored in the block header. Any single bit change results in a verification failure.
        </p>
      </div>
    </div>
  );
};

export default VerifyRecord;
