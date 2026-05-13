import React, { useState, useEffect } from 'react';
import { blockchainService } from '../services/api';
import type { Block } from '../types/blockchain';
import { Database, Activity, Server, Hash } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [height, setHeight] = useState(0);
  const [activeNodes, setActiveNodes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heightRes, blocksRes, networkRes] = await Promise.all([
          blockchainService.getHeight(),
          blockchainService.getBlocks(),
          blockchainService.getNetworkHealth()
        ]);
        setHeight(heightRes.data.height);
        setBlocks(blocksRes.data);
        
        const onlineCount = networkRes.data.nodes.filter((n: any) => n.status === 'online').length;
        setActiveNodes(onlineCount);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Database className="text-blue-600" />} label="Chain Height" value={height.toString()} />
        <StatCard icon={<Activity className="text-emerald-600" />} label="Network Status" value={activeNodes > 0 ? "Healthy" : "Offline"} />
        <StatCard icon={<Server className="text-purple-600" />} label="Active Nodes" value={activeNodes.toString()} />
        <StatCard icon={<Hash className="text-orange-600" />} label="Algorithm" value="SHA-256" />
      </div>

      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-black">Recent Blocks</h2>
        <p className="text-black text-sm">Showing the latest verified blocks on the ledger</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-none" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map(block => (
            <div key={block.index} className="glass-card p-5 hover: - cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-none text-xs font-bold uppercase tracking-wider">
                  Block #{block.index}
                </span>
                <span className="text-slate-400 text-xs">
                  {new Date(block.timestamp * 1000).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="space-y-3">
                <HashEntry label="Block Hash" value={block.block_hash} />
                <HashEntry label="Merkle Root" value={block.merkle_root} />
                
                <div className="pt-3 border-t border-black flex justify-between items-center">
                  <span className="text-sm text-black">
                    <span className="font-bold">{block.transaction_count}</span> Transactions
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Validator: :{block.validator_port}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="glass-card p-4 flex items-center gap-4">
    <div className="p-3 bg-white rounded-none">{icon}</div>
    <div>
      <p className="text-xs text-black font-medium">{label}</p>
      <p className="text-xl font-bold text-black">{value}</p>
    </div>
  </div>
);

const HashEntry = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
    <p className="text-xs text-black font-mono truncate" title={value}>{value}</p>
  </div>
);

export default Dashboard;
