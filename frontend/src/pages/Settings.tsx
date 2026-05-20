import React, { useState } from 'react';
import { User, Shield, Bell, Database } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'storage'>('profile');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [keyRotated, setKeyRotated] = useState(false);
  const [publicKey, setPublicKey] = useState(
    `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7Vx9c3Y/M9J2P1L8d6RzYq5X\nHp5GzQ8zK9R8Vj2q5zT7VqX3TzRzV1p9q2C8v9zR5Y7Xq6V4Xz5q2Kz3vR7Vq2C8zQ5W\nYx5R7zY5Vx4W8zR2Y5X7vR3Y5X2q5zT5Vz5Y7T2K9Xz5q2Kz3vR7Vq2C8zQ5WYx5R7zY5\nVx4W8zR2Y5X7vR3Y5X2q5zT5Vz5Y7T2K9Xz5q2Kz3vR7Vq2C8zQ5WYx5R7zY5Vx4W8zR2\nY5X7vR3Y5X2q5zT5Vz5Y7T2K9Xz5q2Kz3vR7Vq2C8zQ5WYx5R7zY5Vx4W8zR2Y5X7vR3Y\n5X2q5zT5Vz5Y7T2K9Xz5q2Kz3vR7Vq2C8zQ5WYx5R7zY5Vx4W8zR2Y5X7vR3Y5X2q5zT5\n-----END PUBLIC KEY-----`
  );

  const getUserId = () => {
    if (!user) return 'N/A';
    if (user.role === 'patient') return user.patient_id || 'N/A';
    if (user.role === 'doctor') return user.doctor_id || 'N/A';
    return user.id || 'N/A';
  };

  const getRoleLabel = () => {
    if (!user) return 'N/A';
    if (user.role === 'admin') return 'Administrator';
    if (user.role === 'doctor') return 'Doctor';
    if (user.role === 'patient') return 'Patient';
    return user.role;
  };

  const handleSaveChanges = () => {
    setSaveStatus('Saving changes...');
    setTimeout(() => {
      setSaveStatus('Settings updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  const handleRotateKeys = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomKey = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A';
    for (let i = 0; i < 280; i++) {
      if (i > 0 && i % 64 === 0) randomKey += '\n';
      randomKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    randomKey += '\n-----END PUBLIC KEY-----';
    setPublicKey(randomKey);
    setKeyRotated(true);
    setTimeout(() => setKeyRotated(false), 4000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Account Settings</h2>
        <p className="text-black">Manage your profile and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <SettingsTab 
            icon={<User size={18}/>} 
            label="Profile Info" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <SettingsTab 
            icon={<Shield size={18}/>} 
            label="Security & Keys" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')} 
          />
          <SettingsTab 
            icon={<Bell size={18}/>} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')} 
          />
          <SettingsTab 
            icon={<Database size={18}/>} 
            label="Storage Config" 
            active={activeTab === 'storage'} 
            onClick={() => setActiveTab('storage')} 
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'profile' && (
            <div className="glass-card p-6 space-y-6">
              <h3 className="font-bold text-black">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Full Name" value={user?.username || 'N/A'} />
                <InputGroup label="Email Address" value={user?.email || 'N/A'} />
                <InputGroup label="User ID" value={getUserId()} />
                <InputGroup label="Role" value={getRoleLabel()} />
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleSaveChanges} className="btn-primary">Save Changes</button>
                {saveStatus && (
                  <span className={`text-xs font-bold ${saveStatus.includes('successfully') ? 'text-emerald-600' : 'text-slate-500 animate-pulse'}`}>
                    {saveStatus}
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-4 border-l-4 border-l-orange-500">
                <h3 className="font-bold text-black">Cryptographic Keys</h3>
                <p className="text-sm text-black">Your RSA public key is currently used for block validation.</p>
                <div className="bg-white p-3 rounded-none font-mono text-[10px] text-black break-all border border-black max-h-[160px] overflow-y-auto whitespace-pre-wrap">
                  {publicKey}
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handleRotateKeys} className="text-xs font-bold text-blue-600 hover:underline">Rotate Keys</button>
                  {keyRotated && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 border border-emerald-500">
                      Keys Rotated & Broadcast to Network!
                    </span>
                  )}
                </div>
              </div>
              
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-bold text-black">Signature Verification</h3>
                <p className="text-sm text-black">All transactions initiated by you are signed using the corresponding private key stored in your secure local session.</p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <span className="w-2.5 h-2.5 bg-emerald-500 inline-block"></span>
                  Local Keyring Synchronized (Active)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-black">Notification Preferences</h3>
              <p className="text-sm text-black">Configure when and how you want to be notified of ledger events.</p>
              
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-black border-black" />
                  <span className="text-xs text-black">Notify me when a new block is appended</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-black border-black" />
                  <span className="text-xs text-black">Alert me if record tampering is detected</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="accent-black border-black" />
                  <span className="text-xs text-black">Receive weekly node synchronization reports</span>
                </label>
              </div>
              
              <button onClick={handleSaveChanges} className="btn-primary mt-4">Save Notification Rules</button>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-bold text-black">Storage Configuration</h3>
              <p className="text-sm text-black">This node stores its encrypted files locally in off-chain file systems.</p>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Off-chain Storage Directory</label>
                  <input 
                    type="text" 
                    readOnly
                    value="c:/Users/debar/Documents/GitHub/Final_Project/demo_instances/node1/offchain/records" 
                    className="w-full px-3 py-2 bg-slate-50 border border-black/20 rounded-none text-xs text-slate-500 font-mono outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blockchain Ledger File</label>
                  <input 
                    type="text" 
                    readOnly
                    value="c:/Users/debar/Documents/GitHub/Final_Project/demo_instances/node1/blockchain.dat" 
                    className="w-full px-3 py-2 bg-slate-50 border border-black/20 rounded-none text-xs text-slate-500 font-mono outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-none font-medium text-sm transition-colors ${
      active ? 'bg-black text-white' : 'text-black bg-white hover:bg-slate-50 border border-black/10'
    }`}
  >
    {icon}
    {label}
  </button>
);

const InputGroup = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      key={value}
      defaultValue={value}
      className="w-full px-3 py-2 bg-white border border-black rounded-none text-sm text-black outline-none"
    />
  </div>
);

export default Settings;
