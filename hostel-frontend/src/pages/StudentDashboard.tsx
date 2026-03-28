import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import type { Status, Category } from '../context/ComplaintContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, CheckCircle2, AlertCircle, Edit2, Trash2, Search, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
  const { complaints, addComplaint, deleteComplaint, isLoading } = useComplaints();
  const [filter, setFilter] = useState<Status | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('WiFi');

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }
    await addComplaint({ title, description, category });
    toast.success('Complaint submitted successfully');
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'In Progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'In Progress': return <AlertCircle className="w-3 h-3" />;
      case 'Resolved': return <CheckCircle2 className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
              Your Complaints
            </h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">
              Track and manage hostel issues
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search issues..." 
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm font-light"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-2 transition-all duration-300 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              New Complaint
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/5 backdrop-blur-sm shadow-inner">
          {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === s 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-white/40 hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Complaints Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card animate-pulse h-64 border-white/5" />
            ))}
          </div>
        ) : filteredComplaints.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredComplaints.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="glass-card group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(c.status)}`}>
                        {getStatusIcon(c.status)}
                        {c.status}
                      </div>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                        {c.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
                      {c.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <span className="text-[10px] text-white/20 tabular-nums">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all transform hover:-translate-y-1">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteComplaint(c.id)}
                        className="p-2.5 rounded-xl bg-destructive/5 text-destructive/40 hover:bg-destructive hover:text-white transition-all transform hover:-translate-y-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 glass rounded-3xl border-dashed border-white/10">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary opacity-50" />
            </div>
            <h2 className="text-2xl font-black text-white/60">No complaints found</h2>
            <p className="text-white/20 mt-2 max-w-xs mx-auto">Try adjusting your filters or raise a new complaint to get started.</p>
          </div>
        )}
      </main>

      {/* Raise Complaint Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg glass rounded-[2.5rem] p-10 relative overflow-hidden ring-1 ring-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Raise Issue</h2>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Title</label>
                  <input
                    type="text"
                    placeholder="Briefly describe the issue"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-light"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Category</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-light appearance-none cursor-pointer"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Category)}
                    >
                      <option className="bg-slate-900" value="WiFi">WiFi</option>
                      <option className="bg-slate-900" value="Water">Water</option>
                      <option className="bg-slate-900" value="Electricity">Electricity</option>
                      <option className="bg-slate-900" value="Food">Food</option>
                      <option className="bg-slate-900" value="Cleaning">Cleaning</option>
                      <option className="bg-slate-900" value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 opacity-30">
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Room No</label>
                    <input disabled value="302" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about the problem..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-light resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 transition-all duration-300 mt-4 group"
                >
                  Submit Complaint
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;
