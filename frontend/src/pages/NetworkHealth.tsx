import React, { useState, useEffect } from 'react';
import { Server, Network, Activity, Wifi } from 'lucide-react';
import { blockchainService } from '../services/api';
import type { NetworkNode } from '../types/blockchain';

const NetworkHealth: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthRes = await blockchainService.getNetworkHealth();
        setNodes(healthRes.data.nodes);
      } catch (err) {
        console.error('Failed to fetch network data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const onlineNodes = nodes.filter(n => n.status === 'online');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-black flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-white shadow-lg shadow-emerald-200">
              <Network size={28} />
            </div>
            Network Status
          </h2>
          <p className="text-slate-500 font-medium">Real-time distributed validator monitoring</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${onlineNodes.length > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-xs font-bold text-black uppercase tracking-wider">{onlineNodes.length} Nodes Active</span>
          </div>
        </div>
      </div>

      {loading && nodes.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-card h-48 animate-pulse bg-slate-50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {nodes.map((node) => (
            <div 
              key={node.port} 
              className={`glass-card p-6 border-b-4 transition-all duration-300 hover:-translate-y-1 ${
                node.status === 'online' 
                  ? 'border-b-emerald-500 hover:shadow-xl hover:shadow-emerald-100' 
                  : 'border-b-red-500 grayscale opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${
                  node.port === 8001 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Server size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wifi size={12} className={node.status === 'online' ? 'text-emerald-500' : 'text-red-500'} />
                    <span className={`text-[10px] font-black uppercase ${
                      node.status === 'online' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">#PORT_{node.port}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-black truncate">
                    {node.port === 8001 ? 'Master Validator' : `Node Instance ${node.port - 8000}`}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                    {node.type}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                    <Activity size={12} className="text-blue-500" /> Latency
                  </div>
                  <span className="text-[10px] font-mono font-black text-emerald-600">{node.latency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* <div className="lg:col-span-2 glass-card p-8 space-y-6 bg-gradient-to-br from-white to-slate-50">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-black flex items-center gap-2 text-lg">
              <Globe size={22} className="text-blue-500" />
              Global Consensus Sync
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
              {onlineNodes.length > 0 ? 'Syncing...' : 'Paused'}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000 shadow-lg" 
                style={{ width: `${height > 0 ? 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Block Height: {height} / {height}</span>
              <span>Propagating to {onlineNodes.length} Nodes</span>
            </div>
          </div>
        </div> */}

        {/* <div className={`glass-card p-8 flex flex-col justify-center space-y-4 ${healthScore > 50 ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${healthScore > 50 ? 'text-emerald-800' : 'text-red-800'}`}>Network Health Score</p>
          <div className={`text-5xl font-black ${healthScore > 50 ? 'text-emerald-600' : 'text-red-600'}`}>{healthScore.toFixed(1)}%</div>
          <p className={`text-xs font-medium ${healthScore > 50 ? 'text-emerald-700/60' : 'text-red-700/60'}`}>
            {onlineNodes.length} systems operational across distributed clusters.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default NetworkHealth;
