import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import type { Status, Category } from '../context/ComplaintContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Trash2, Search, ChevronDown, MoreVertical, LayoutDashboard, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { complaints, updateStatus, deleteComplaint } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'In Progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const handleStatusChange = async (id: string, newStatus: Status) => {
    await updateStatus(id, newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
              Admin Interface
            </h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
              Central Complaint Oversight
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 shadow-inner backdrop-blur-md">
                <button className="px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20">
                  Overview
                </button>
                <button className="px-4 py-2 text-white/40 hover:text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                  Analytics
                </button>
             </div>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 glass-card flex flex-col md:flex-row items-center gap-4 py-4 px-6 border-white/5">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search by student or title..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm font-light"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select 
                className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer flex-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
              >
                <option value="All" className="bg-slate-900">All Status</option>
                <option value="Pending" className="bg-slate-900">Pending</option>
                <option value="In Progress" className="bg-slate-900">In Progress</option>
                <option value="Resolved" className="bg-slate-900">Resolved</option>
              </select>
              
              <select 
                className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer flex-1"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
              >
                <option value="All" className="bg-slate-900">All Categories</option>
                <option value="WiFi" className="bg-slate-900">WiFi</option>
                <option value="Water" className="bg-slate-900">Water</option>
                <option value="Electricity" className="bg-slate-900">Electricity</option>
                <option value="Food" className="bg-slate-900">Food</option>
              </select>
            </div>
          </div>

          <div className="glass-card flex items-center justify-between border-primary/20 bg-primary/5">
             <div>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Total Issues</p>
                <p className="text-3xl font-black tabular-nums">{complaints.length}</p>
             </div>
             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20">
                <LayoutDashboard className="w-6 h-6 text-primary" />
             </div>
          </div>
        </div>

        {/* Table View */}
        <div className="glass rounded-[2rem] border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Issue Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Category</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((c) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={c.id} 
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.userName}`} 
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-0.5"
                            alt="avatar"
                          />
                          <div>
                            <p className="text-sm font-bold text-white leading-none mb-1">{c.userName}</p>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Room 302</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{c.title}</p>
                        <p className="text-xs text-white/40 truncate max-w-xs font-light">{c.description}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10 text-white/40">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="relative inline-block text-left">
                          <select 
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value as Status)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border focus:outline-none transition-all cursor-pointer appearance-none pr-8 ${getStatusColor(c.status)}`}
                          >
                            <option value="Pending" className="bg-slate-900 text-yellow-500">Pending</option>
                            <option value="In Progress" className="bg-slate-900 text-blue-500">In Progress</option>
                            <option value="Resolved" className="bg-slate-900 text-emerald-500">Resolved</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                           </button>
                           <button 
                            onClick={() => deleteComplaint(c.id)}
                            className="p-2 rounded-lg bg-destructive/5 text-destructive/40 hover:bg-destructive hover:text-white transition-all transform hover:-rotate-12"
                           >
                            <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center text-white/20">
                       <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
                       <h3 className="text-lg font-bold">No results matching your filters</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
         <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white/40 hover:text-white border border-white/10 shadow-2xl transition-all"
         >
            <Settings className="w-6 h-6" />
         </motion.button>
      </div>
    </div>
  );
};

export default AdminDashboard;
