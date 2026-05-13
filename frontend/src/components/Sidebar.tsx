import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Search, 
  Database, 
  ShieldCheck, 
  Settings, 
  Activity,
  History,
  Network
} from 'lucide-react';

interface SidebarProps {
  role: 'patient' | 'doctor' | 'admin';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const commonLinks = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  ];

  const roleLinks = {
    patient: [
      { to: "/my-records", icon: <FileText size={20} />, label: "My Records" },
      { to: "/verify", icon: <ShieldCheck size={20} />, label: "Verify Record" },
    ],
    doctor: [
      { to: "/upload", icon: <Upload size={20} />, label: "Upload Record" },
      { to: "/patients", icon: <Search size={20} />, label: "Patient Search" },
      { to: "/activity", icon: <History size={20} />, label: "Activity Logs" },
    ],
    admin: [
      { to: "/explorer", icon: <Database size={20} />, label: "Block Explorer" },
      { to: "/network", icon: <Network size={20} />, label: "Node Health" },
      { to: "/logs", icon: <Activity size={20} />, label: "System Logs" },
      { to: "/upload", icon: <Upload size={20} />, label: "Upload Record" },
      { to: "/patients", icon: <Search size={20} />, label: "Patient Search" },
      { to: "/activity", icon: <History size={20} />, label: "Activity Logs" },
      { to: "/my-records", icon: <FileText size={20} />, label: "All Records" },
      { to: "/verify", icon: <ShieldCheck size={20} />, label: "Verify Record" },
    ]
  };

  const links = [...commonLinks, ...(roleLinks[role] || [])];

  return (
    <aside className="w-64 bg-white border-r border-black h-[calc(100vh-64px)] p-4 flex flex-col gap-2 sticky top-16">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 rounded-none  font-medium text-sm ${
              isActive 
                ? 'bg-blue-50 text-blue-600 ' 
                : 'text-black hover:bg-white hover:text-black'
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}

      <div className="mt-auto pt-4 border-t border-black">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-none text-black hover:bg-white hover:text-black font-medium text-sm"
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
