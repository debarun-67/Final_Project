import React, { useState, useEffect } from 'react';
import { Activity, Server, Network, Globe, AlertCircle } from 'lucide-react';
import { blockchainService } from '../services/api';

const NetworkHealth: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const { data } = await blockchainService.getNetworkHealth();
        setNodes(data.nodes);
      } catch (err) {
        console.error('Failed to fetch network health:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
    // Poll every 10 seconds
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <Network className="text-emerald-600" size={24} />
          Network Topology
        </h2>
        <p className="text-black">Monitor distributed validator nodes and P2P synchronization status</p>
      </div>

      {loading ? (
        <div className="text-center p-8 text-slate-500">Checking network health...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodes.map(node => (
            <div key={node.port} className={`glass-card p-6 border-l-4 ${
              node.status === 'online' ? 'border-l-emerald-500' : 'border-l-red-500'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white rounded-none text-black">
                  <Server size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-bold uppercase ${
                    node.status === 'online' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {node.status}
                  </span>
                  <span className="text-xs text-slate-400">Port {node.port}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Node Type</p>
                  <p className="text-sm font-bold text-black">{node.type}</p>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1 text-xs text-black">
                    <Activity size={12} /> Latency
                  </div>
                  <span className="text-xs font-mono font-bold text-black">{node.latency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-bold text-black flex items-center gap-2">
          <Globe size={18} className="text-blue-500" />
          Global Sync Status
        </h3>
        <div className="relative h-2 bg-white rounded-none overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-blue-500 w-2/3" />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Syncing block 142/210</span>
          <span>67% Complete</span>
        </div>
      </div>
      
      {nodes.some(n => n.status === 'offline') && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-none flex gap-3 text-red-600">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-xs leading-relaxed font-medium">
            One or more validator nodes are unreachable. This may impact the network's ability to reach 
            consensus on new transactions. Check node logs for details.
          </p>
        </div>
      )}
    </div>
  );
};

export default NetworkHealth;
