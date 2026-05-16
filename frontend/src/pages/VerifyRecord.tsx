import React, { useState } from 'react';
import { recordService } from '../services/api';
import { ShieldCheck, Upload, FileCheck, XCircle, AlertTriangle, Hash, Database, User } from 'lucide-react';

interface VerifyResult {
  valid: boolean;
  message: string;
  block_index?: number;
  tx_index?: number;
  data_hash?: string;
  computed_hash?: string;
  data_pointer?: string;
  patient_id?: string;
  doctor_id?: string;
}

const VerifyRecord: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!file) return;
    setIsVerifying(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('record', file);

    try {
      const response = await recordService.verify(formData);
      setResult(response.data as VerifyResult);
    } catch (err: unknown) {
      const httpErr = err as { response?: { data?: { error?: string } } };
      setError(httpErr?.response?.data?.error || 'Verification request failed. Check backend connection.');
    } finally {
      setIsVerifying(false);
    }
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
          className={`border-2 border-dashed rounded-none p-10 text-center ${
            file ? 'border-emerald-400 bg-emerald-50/30' : 'border-black hover:border-black'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]); }}
        >
          {file ? (
            <div className="space-y-4">
              <FileCheck size={48} className="mx-auto text-emerald-600" />
              <div>
                <p className="font-bold text-black">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={() => { setFile(null); setResult(null); setError(null); }}
                className="text-xs text-slate-400 underline"
              >
                Change File
              </button>
            </div>
          ) : (
            <label className="cursor-pointer space-y-4 block">
              <Upload size={48} className="mx-auto text-slate-200" />
              <p className="text-black italic">Drop your encrypted report here</p>
              <span className="btn-secondary inline-block">Select File</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
              />
            </label>
          )}
        </div>

        {/* Match — real blockchain data */}
        {result?.valid && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-none space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <ShieldCheck size={22} />
              <span>Verified Successfully</span>
            </div>
            <p className="text-xs text-emerald-700 opacity-80">
              This file matches the immutable record on the blockchain.
            </p>
            <div className="grid grid-cols-1 gap-2 text-sm pt-1 border-t border-emerald-200">
              <div className="flex items-center gap-2 text-slate-700">
                <Database size={13} className="text-emerald-600 shrink-0" />
                <span className="font-semibold w-24 shrink-0">Block:</span>
                <span className="font-mono">#{result.block_index} (tx #{result.tx_index})</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <Hash size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold w-24 shrink-0">SHA-256:</span>
                <span className="font-mono text-xs break-all">{result.data_hash}</span>
              </div>
              {result.patient_id && (
                <div className="flex items-center gap-2 text-slate-700">
                  <User size={13} className="text-emerald-600 shrink-0" />
                  <span className="font-semibold w-24 shrink-0">Patient:</span>
                  <span className="font-mono">{result.patient_id}</span>
                </div>
              )}
              {result.doctor_id && (
                <div className="flex items-center gap-2 text-slate-700">
                  <User size={13} className="text-emerald-600 shrink-0" />
                  <span className="font-semibold w-24 shrink-0">Doctor:</span>
                  <span className="font-mono">{result.doctor_id}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Not found / tampered */}
        {result && !result.valid && (
          <div className="p-5 bg-red-50 border border-red-200 rounded-none space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold">
              <XCircle size={22} />
              <span>Not Found on Blockchain</span>
            </div>
            <p className="text-xs text-red-700 opacity-80">{result.message}</p>
            {result.computed_hash && (
              <div className="flex items-start gap-2 text-slate-700 text-sm pt-1 border-t border-red-200">
                <Hash size={13} className="text-red-500 shrink-0 mt-0.5" />
                <span className="font-semibold w-28 shrink-0">Computed hash:</span>
                <span className="font-mono text-xs break-all">{result.computed_hash}</span>
              </div>
            )}
          </div>
        )}

        {/* API / network error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-none border border-red-100">
            <XCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!file || isVerifying}
          className="w-full btn-primary h-12 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Computing SHA-256...
            </>
          ) : 'Check Authenticity'}
        </button>
      </div>

      <div className="flex gap-4 p-4 bg-blue-50/50 border border-black rounded-none text-blue-600">
        <AlertTriangle size={20} className="shrink-0" />
        <p className="text-xs leading-relaxed">
          <strong>Note:</strong> We re-compute the SHA-256 fingerprint of your file on the server and compare it
          against every transaction's <code>data_hash</code> stored in the blockchain ledger. Any single-bit
          change results in a verification failure.
        </p>
      </div>
    </div>
  );
};

export default VerifyRecord;
