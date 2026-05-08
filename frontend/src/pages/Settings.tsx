import React from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Database } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
        <p className="text-slate-500">Manage your profile and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <SettingsTab icon={<User size={18}/>} label="Profile Info" active />
          <SettingsTab icon={<Shield size={18}/>} label="Security & Keys" />
          <SettingsTab icon={<Bell size={18}/>} label="Notifications" />
          <SettingsTab icon={<Database size={18}/>} label="Storage Config" />
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="font-bold text-slate-800">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Full Name" value="Debarun Biswas" />
              <InputGroup label="Email Address" value="debarun@hospital.org" />
              <InputGroup label="User ID" value="USER-7721" />
              <InputGroup label="Role" value="Administrator" />
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>

          <div className="glass-card p-6 space-y-4 border-l-4 border-l-orange-500">
            <h3 className="font-bold text-slate-800">Cryptographic Keys</h3>
            <p className="text-sm text-slate-500">Your RSA public key is currently used for block validation.</p>
            <div className="bg-slate-50 p-3 rounded font-mono text-[10px] text-slate-500 break-all border border-slate-100">
              -----BEGIN PUBLIC KEY-----
              MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7V...
              -----END PUBLIC KEY-----
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline">Rotate Keys</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'
  }`}>
    {icon}
    {label}
  </button>
);

const InputGroup = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      defaultValue={value}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Settings;
