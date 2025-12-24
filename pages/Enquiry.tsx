import React, { useState } from 'react';
import { useApp } from '../App';
import * as reactRouterDom from 'react-router-dom';
const { Link, useNavigate } = reactRouterDom as any;
import { Trash2, Send, CheckCircle, PackageSearch, ArrowLeft, ShieldCheck, MapPin, ChevronRight, Lock, Loader2 } from 'lucide-react';
import { CITIES } from '../constants';
import { supabase } from '../lib/supabase';

const EnquiryPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, user } = useApp();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: CITIES[0].name,
    location: '',
    projectType: 'Residential',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth', { state: { from: '/enquiry' } });
      return;
    }
    if (cart.length === 0) return alert("Your procurement list is empty!");

    setIsSubmitting(true);
    const newOrderId = `MCART-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const { error } = await supabase
      .from('orders')
      .insert([{
        order_id: newOrderId,
        customer_name: formData.name,
        phone: formData.phone,
        city: formData.city,
        location: formData.location,
        project_type: formData.projectType,
        items: cart,
        status: 'Pending',
        user_id: user.id
      }]);

    setIsSubmitting(false);

    if (error) {
      alert(`Submission error: ${error.message}`);
      return;
    }
    
    setOrderId(newOrderId);
    setIsSubmitted(true);
    clearCart();
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fadeIn font-sans">
        <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-200 shadow-sm">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">Order Locked In</h1>
        <p className="text-slate-500 text-lg font-medium mb-12 px-6 leading-relaxed">
          The <strong className="text-slate-900">MaterialCart</strong> logistics desk is now verifying stock for <strong className="text-slate-900">{formData.name}</strong>. Your unique ID for tracking is below.
        </p>
        <div className="bg-slate-900 p-10 rounded-[3rem] mb-12 shadow-2xl border border-white/5">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block mb-2">Unique Procurement ID</span>
          <span className="text-5xl font-black text-brand-500 font-mono tracking-tighter">{orderId}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link to="/" className="bg-slate-100 text-slate-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">Back to Market</Link>
          <button onClick={() => navigate('/track')} className="bg-brand-500 text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-900 hover:text-white transition-all shadow-xl">Track Live Status</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center font-sans">
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 border border-slate-100 shadow-inner">
           <PackageSearch size={56} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">Procurement List Empty</h1>
        <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em] mb-12">Return to the catalog to select structural materials for your site.</p>
        <Link to="/listing" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-brand-500 hover:text-slate-900 transition-all shadow-2xl inline-flex items-center gap-3">
          <ArrowLeft size={18} /> Catalog Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-50 min-h-screen py-12 md:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
           <span>Supply Chain</span>
           <ChevronRight size={12} />
           <span className="text-slate-900">Checkout Process</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-16 tracking-tighter uppercase font-display">Confirm Procurement</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="space-y-10">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              Selections for Audit <span className="bg-brand-500 text-slate-900 px-3 py-1 rounded-xl text-xs font-black shadow-sm">{cart.length}</span>
            </h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.productId} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center group shadow-sm hover:border-brand-500/30 transition-all">
                  <div className="flex-grow min-w-0 pr-4">
                    <h4 className="font-extrabold text-slate-900 uppercase tracking-tight text-base mb-1">{item.productName}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {item.quantity} {item.uom} • Mandi Price Parity Guaranteed
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-3 text-slate-300 hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
              <ShieldCheck size={120} className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none" />
              <h4 className="text-brand-400 font-black uppercase tracking-[0.2em] text-[11px] mb-8">MaterialCart Protection</h4>
              <div className="space-y-8">
                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-white/5 rounded-2xl text-brand-500 border border-white/10 shadow-lg"><Lock size={20}/></div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-tight mb-1.5">Rate Lock-In</p>
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed opacity-90">Upon confirmation, your price is protected from daily Mandi fluctuations.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-white/5 rounded-2xl text-brand-500 border border-white/10 shadow-lg"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-tight mb-1.5">Site-Specific Logistics</p>
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed opacity-90">Optimized routing for Sangli, Miraj, and Kupwad SMK belt industrial zones.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-14 rounded-[4rem] border border-slate-200 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.08)]">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter font-display mb-3">Site Logistics</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Provide site details for delivery scheduling</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {!user && (
                <div className="bg-brand-500/5 border border-brand-500/20 p-6 rounded-3xl flex items-center gap-4 text-brand-600">
                  <Lock size={20} />
                  <p className="text-[11px] font-black uppercase tracking-widest">Login required to secure your order</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Name / Manager</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-6 py-4.5 rounded-2xl border bg-slate-50/50 outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full px-6 py-4.5 rounded-2xl border bg-slate-50/50 outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm"
                    placeholder="WhatsApp enabled"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Region</label>
                  <select 
                    className="w-full px-6 py-4.5 rounded-2xl border bg-slate-50/50 outline-none font-bold text-sm focus:bg-white focus:border-brand-500 transition-all appearance-none"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  >
                    {CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Construction Type</label>
                  <select 
                    className="w-full px-6 py-4.5 rounded-2xl border bg-slate-50/50 outline-none font-bold text-sm focus:bg-white focus:border-brand-500 transition-all appearance-none"
                    value={formData.projectType}
                    onChange={e => setFormData({...formData, projectType: e.target.value})}
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Landmarks & Street</label>
                <textarea 
                  required
                  className="w-full px-6 py-4.5 rounded-2xl border bg-slate-50/50 outline-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white focus:border-brand-500 transition-all font-bold text-sm h-32 resize-none"
                  placeholder="Plot No., near school, main road intersection..."
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-brand-500 hover:text-slate-900 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />} 
                  {user ? 'BUY NOW / LOCK QUOTE' : 'LOGIN TO BUY'}
                </button>
                <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest mt-8 leading-relaxed">By clicking buy, you initiate a formal audit. Final delivery schedule and mandi rates will be confirmed on call.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;