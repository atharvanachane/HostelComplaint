import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, ShieldCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center ring-1 ring-white/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white leading-none">FixMyHostel</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
              {user?.role} Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors relative group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-slate-950" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              Notifications
            </div>
          </button>

          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-[10px] text-white/40">{user?.email}</p>
            </div>
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-xl border border-white/10 p-0.5 bg-white/5"
            />
          </div>

          <button
            onClick={logout}
            className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center hover:bg-destructive hover:text-white transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
