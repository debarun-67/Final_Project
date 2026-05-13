import React, { useState, useEffect } from 'react';
import { Database, Hash, Link as LinkIcon, Cpu, ShieldCheck, Loader2 } from 'lucide-react';
import { blockchainService } from '../services/api';
import type { Block } from '../types/blockchain';

const BlockExplorer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const [verifying, setVerifying] = useState(false);

  const fetchBlocks = async () => {
    try {
      const { data } = await blockchainService.getBlocks();
      setBlocks(data);
    } catch (err) {
      console.error('Failed to fetch explorer data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const { data } = await blockchainService.verifyChain();
      if (data.valid) {
        alert('SUCCESS: Blockchain Integrity SECURE. All cryptographic links verified.');
      } else {
        alert('WARNING: TAMPERING DETECTED! One or more blocks have invalid hashes or signatures.');
      }
    } catch (err) {
      alert('Error: Could not connect to validator node.');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
    const interval = setInterval(fetchBlocks, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Database className="text-blue-600" size={24} />
            Ledger Explorer
          </h2>
          <p className="text-black text-sm">Deep inspection of the blockchain state and cryptographic links</p>
        </div>
        <button 
          onClick={handleVerify}
          disabled={verifying}
          className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {verifying ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
          {verifying ? 'Verifying...' : 'Verify Full Chain'}
        </button>
      </div>

      {loading && blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Ledger...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.length === 0 && (
            <div className="glass-card p-12 text-center text-slate-400 font-bold uppercase tracking-widest">
              Blockchain is currently empty
            </div>
          )}
          {blocks.map((block) => (
            <div key={block.index} className="glass-card overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white px-6 py-3 border-b border-black flex justify-between items-center">
                <span className="font-mono text-sm font-bold text-black">BLOCK_INDEX: {block.index}</span>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-none font-bold">
                    VALIDATOR: {block.validator_port}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-none font-bold">IMMUTABLE</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <DataField icon={<Hash size={14}/>} label="Block Hash" value={block.block_hash} />
                  <DataField icon={<LinkIcon size={14}/>} label="Previous Hash" value={block.previous_hash} />
                  <DataField icon={<Cpu size={14}/>} label="Merkle Root" value={block.merkle_root} />
                </div>
                <div className="bg-white/50 rounded-none p-4 border border-black space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata</p>
                  <MetaItem label="Timestamp" value={new Date(block.timestamp * 1000).toLocaleString()} />
                  <MetaItem label="TX Count" value={block.transaction_count.toString()} />
                  <MetaItem label="Size" value={`${(sizeofBlock()).toString()} Bytes`} />
                  <div className="pt-2">
                    <button className="w-full py-1.5 text-xs font-bold text-blue-600 border border-black rounded-none hover:bg-blue-50">
                      View raw data (Hex)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper for static size
const sizeofBlock = () => 1024; // Approximation for UI

const DataField = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
      {icon} {label}
    </label>
    <div className="bg-white border border-black rounded-none px-3 py-2 font-mono text-xs text-black">
      {value}
    </div>
  </div>
);

const MetaItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-black">{label}</span>
    <span className="font-bold text-black">{value}</span>
  </div>
);

export default BlockExplorer;
