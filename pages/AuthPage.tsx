
import React, { useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Mail, Lock, Loader2, UserPlus, LogIn, HardHat, Building2, ChevronRight } from 'lucide-react';

const { useNavigate, useLocation } = reactRouterDom as any;

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    e?.preventDefault();
    setIsLoading(true);
    
    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    try {
      const { data, error } = isLogin 
        ? await supabase.auth.signInWithPassword({ email: targetEmail, password: targetPass })
        : await supabase.auth.signUp({ email: targetEmail, password: targetPass });

      if (error) throw error;

      if (data.user) {
        const isAdmin = targetEmail.includes('admin');
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          const from = (location as any).state?.from || '/listing';
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      alert(`Authentication failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setEmail('admin@materialcart.com');
      setPassword('admin123');
      handleAuth(undefined, 'admin@materialcart.com', 'admin123');
    } else {
      setEmail('site.manager@sangli.com');
      setPassword('manager123');
      handleAuth(undefined, 'site.manager@sangli.com', 'manager123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fcfcfc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-slideInUp">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto mb-6 shadow-xl shadow-zinc-200">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">Workspace Access</h1>
          <p className="text-zinc-500 text-sm font-medium">Authenticate to manage structural procurement.</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]">
          <div className="flex p-1 bg-zinc-100 rounded-xl mb-8">
             <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isLogin ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
             >
               Login
             </button>
             <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${!isLogin ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
             >
               Register
             </button>
          </div>

          <form onSubmit={(e) => handleAuth(e)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Email Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input 
                    required
                    type="email" 
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1">Secure Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input 
                    required
                    type="password" 
                    className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? <LogIn size={18}/> : <UserPlus size={18}/>)}
              {isLogin ? 'Enter Workspace' : 'Create Account'}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-100">
             <div className="flex items-center gap-2 mb-6">
                <div className="h-px flex-grow bg-zinc-100"></div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Demo Access</span>
                <div className="h-px flex-grow bg-zinc-100"></div>
             </div>
             <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => quickLogin('admin')}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Building2 size={18} className="text-zinc-400 group-hover:text-emerald-600" />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-zinc-900 uppercase">Master Admin</p>
                      <p className="text-[10px] text-zinc-400 font-medium">Control all logistics & financials</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-zinc-300 group-hover:text-emerald-600" />
                </button>
                <button 
                  onClick={() => quickLogin('customer')}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <HardHat size={18} className="text-zinc-400 group-hover:text-emerald-600" />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-zinc-900 uppercase">Site Manager</p>
                      <p className="text-[10px] text-zinc-400 font-medium">Procure materials for site</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-zinc-300 group-hover:text-emerald-600" />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
