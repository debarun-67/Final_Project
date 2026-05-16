import React from 'react';
import { Shield, LogOut, User } from 'lucide-react';
import type { AuthUser } from '../types/blockchain';

interface NavbarProps {
  user: AuthUser;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="h-16 bg-white border-b border-black px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-none">
          <Shield className="text-white" size={20} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-black">
          MedChain <span className="text-blue-600">Secure</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-none text-black text-sm font-medium">
              <User size={14} />
              <span>{user.username} ({user.role})</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-slate-400 hover:text-danger p-2"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
