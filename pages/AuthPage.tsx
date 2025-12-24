import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import * as reactRouterDom from 'react-router-dom';
const { useNavigate, useLocation } = reactRouterDom as any;
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, UserPlus, LogIn } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { data, error } = isLogin 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else if (data.user) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl animate-fadeIn">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-brand-500 mx-auto mb-8 shadow-2xl">
            <ShieldCheck size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-display mb-4">Site Manager Access</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">MaterialCart Sourcing Passport</p>
        </div>

        <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-200 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)]">
          <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-12 border border-slate-100">
             <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isLogin ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}
             >
               Login
             </button>
             <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}
             >
               Register
             </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Coordinates</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={20} />
                  <input 
                    required
                    type="email" 
                    className="w-full pl-14 pr-6 py-5 rounded-2xl border bg-slate-50/50 outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
                    placeholder="project@site.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={20} />
                  <input 
                    required
                    type="password" 
                    className="w-full pl-14 pr-6 py-5 rounded-2xl border bg-slate-50/50 outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
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
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-brand-500 hover:text-slate-900 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>)}
              {isLogin ? 'VERIFY ACCESS' : 'CREATE PASSPORT'}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 flex flex-col items-center gap-6">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center opacity-70">
               Secured by MaterialCart Protocol<br/>Region: Sangli SMK Cluster
             </p>
             <div className="flex gap-4 opacity-20">
               <ShieldCheck size={20} />
               <div className="h-5 w-px bg-slate-900"></div>
               <Lock size={20} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;