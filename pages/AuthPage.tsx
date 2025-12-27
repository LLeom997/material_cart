
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import * as reactRouterDom from 'react-router-dom';
const { useNavigate, useLocation } = reactRouterDom as any;
import { ShieldCheck, Mail, Lock, Loader2, UserPlus, LogIn, HardHat, Building2 } from 'lucide-react';

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

    const { data, error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email: targetEmail, password: targetPass })
      : await supabase.auth.signUp({ email: targetEmail, password: targetPass });

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else if (data.user) {
      const isAdmin = targetEmail.includes('admin');
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from || '/listing';
        navigate(from, { replace: true });
      }
    }
  };

  const quickLogin = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      handleAuth(undefined, 'admin@materialcart.com', 'admin123');
    } else {
      handleAuth(undefined, 'site.manager@sangli.com', 'manager123');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-brand-500 mx-auto mb-6">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1 uppercase">Supply Portal</h1>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Authenticated Access Only</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl">
          <div className="flex p-1 bg-gray-50 rounded-xl mb-8">
             <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400'}`}
             >
               Sign In
             </button>
             <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400'}`}
             >
               Register
             </button>
          </div>

          <form onSubmit={(e) => handleAuth(e)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    required
                    type="email" 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 outline-none focus:bg-white focus:border-brand-500 transition-all font-bold text-xs"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    required
                    type="password" 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border bg-gray-50 outline-none focus:bg-white focus:border-brand-500 transition-all font-bold text-xs"
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
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : (isLogin ? <LogIn size={16}/> : <UserPlus size={16}/>)}
              {isLogin ? 'Authenticate' : 'Register Account'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50">
             <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-4">Demo Profiles</p>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => quickLogin('admin')}
                  className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                >
                  <Building2 size={16} className="text-gray-400 group-hover:text-slate-900" />
                  <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-slate-900">Admin</span>
                </button>
                <button 
                  onClick={() => quickLogin('customer')}
                  className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                >
                  <HardHat size={16} className="text-gray-400 group-hover:text-slate-900" />
                  <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-slate-900">Client</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
