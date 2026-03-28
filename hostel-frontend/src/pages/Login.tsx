import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, UserCircle, ShieldCheck, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, role);
      toast.success(`Logged in as ${role}`);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10 px-6"
      >
        <div className="glass-card">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/20">
              <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 tracking-tight">
              FixMyHostel
            </h1>
            <p className="text-white/40 mt-1">Next-Gen Hostel Living</p>
          </div>

          <div className="flex p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'student' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              <UserCircle className="w-4 h-4" /> Student
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'admin' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/40 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="student@hostel.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-light"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/40 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-light"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/20 text-xs mt-8">
            Don't have an account? <span className="text-primary hover:underline cursor-pointer">Register now</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
