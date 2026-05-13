import React from 'react';
import { Database, Hash, Link as LinkIcon, Cpu, ShieldCheck } from 'lucide-react';

const BlockExplorer: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Database className="text-blue-600" size={24} />
            Ledger Explorer
          </h2>
          <p className="text-black">Deep inspection of the blockchain state and cryptographic links</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <ShieldCheck size={18} />
          Verify Full Chain
        </button>
      </div>

      <div className="space-y-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="bg-white px-6 py-3 border-b border-black flex justify-between items-center">
              <span className="font-mono text-sm font-bold text-black">BLOCK_HEIGHT: {i}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-none font-bold">IMMUTABLE</span>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <DataField icon={<Hash size={14}/>} label="Block Hash" value="0000a3f9...b8e2" />
                <DataField icon={<LinkIcon size={14}/>} label="Previous Hash" value="00000000...0000" />
                <DataField icon={<Cpu size={14}/>} label="Merkle Root" value="f2e3...d4c1" />
              </div>
              <div className="bg-white/50 rounded-none p-4 border border-black space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata</p>
                <MetaItem label="Timestamp" value="1715183000" />
                <MetaItem label="Validator" value="Hospital_Node_8001" />
                <MetaItem label="TX Count" value="5" />
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
    </div>
  );
};

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
