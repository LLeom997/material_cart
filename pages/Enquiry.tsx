
import React, { useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
import { Trash2, Send, CheckCircle, PackageSearch, ArrowLeft, ShieldCheck, MapPin, ChevronRight, Lock, Loader2 } from 'lucide-react';
import { CITIES } from '../constants';
import { supabase } from '../lib/supabase';
import { useApp } from '../App';

const { Link, useNavigate } = reactRouterDom as any;

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
    
    // Crucial: check for authenticated user to satisfy Foreign Key constraint (orders.user_id)
    if (!user) {
      alert("Authentication required to place orders. Please sign in.");
      navigate('/auth', { state: { from: '/enquiry' } });
      return;
    }

    if (cart.length === 0) return alert("Your procurement list is empty!");

    setIsSubmitting(true);
    const newOrderId = `MCART-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Calculate total based on cart items (using a dummy base rate for calculation)
    const subtotal = cart.reduce((acc, item) => acc + (item.quantity * 500), 0);
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;

    try {
      // 1. Create Order with validated user.id
      const { error: orderErr } = await supabase
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
          user_id: user.id, // Reference to auth.users.id
          total_amount: total
        }]);

      if (orderErr) throw orderErr;

      // 2. Create Ledger Entry for the Sale
      const { error: ledgerErr } = await supabase
        .from('ledger')
        .insert([{
          order_id: newOrderId,
          type: 'SALE',
          amount: total,
          gst_amount: gstAmount,
          margin: total * 0.1, // Demo 10% margin
          notes: `Automatic Sale Log: ${newOrderId}`
        }]);

      if (ledgerErr) {
        console.warn("Ledger logging failed but order was placed:", ledgerErr.message);
      }

      setOrderId(newOrderId);
      setIsSubmitted(true);
      clearCart();
    } catch (err: any) {
      console.error("Procurement submission failed:", err);
      alert(`Submission error: ${err.message}. Ensure your profile is correctly synced.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fadeIn font-sans">
        <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
          <CheckCircle size={48} className="text-emerald-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase font-display">Procurement Locked</h1>
        <p className="text-slate-500 text-lg font-medium mb-12 px-6 leading-relaxed">
          The <strong className="text-slate-900">MaterialCart</strong> logistics desk has received your manifest. Stock verification for <strong className="text-slate-900">{formData.name}</strong> has started.
        </p>
        <div className="bg-slate-900 p-12 rounded-[4rem] mb-12 shadow-2xl border border-white/5 flex flex-col items-center">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] block mb-4">Tracking Identifier</span>
          <span className="text-5xl font-black text-white font-mono tracking-tighter mb-2">{orderId}</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Region: {formData.city} • Verified</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/" className="bg-slate-100 text-slate-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all">Catalog Home</Link>
          <button onClick={() => navigate('/track')} className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-900 transition-all shadow-xl shadow-emerald-100">Client Workspace</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center font-sans">
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 border border-slate-100">
           <PackageSearch size={56} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">No Material Selected</h1>
        <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em] mb-12">Return to the catalog to choose structural materials.</p>
        <Link to="/listing" className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-all shadow-2xl inline-flex items-center gap-3">
          <ArrowLeft size={18} /> Catalog Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc] min-h-screen py-12 md:py-24 font-sans border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
           <span>Procurement</span>
           <ChevronRight size={12} />
           <span className="text-slate-900">Logistics Manifest</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-16 tracking-tighter uppercase font-display">Confirm Procurement</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-8">
                Material List <span className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-xs font-black shadow-sm">{cart.length}</span>
              </h2>
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.productId} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center group shadow-sm hover:border-emerald-500/30 transition-all">
                    <div className="flex-grow min-w-0 pr-4">
                      <h4 className="font-extrabold text-slate-900 uppercase tracking-tight text-sm mb-1">{item.productName}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         {item.quantity} {item.uom} • SMK Belt Verified
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-10 bg-zinc-900 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
              <ShieldCheck size={120} className="absolute top-0 right-0 p-6 opacity-[0.05] pointer-events-none" />
              <h4 className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[11px] mb-8">Material Protection Suite</h4>
              <div className="space-y-8">
                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-white/5 rounded-2xl text-emerald-500 border border-white/10 shadow-lg"><Lock size={20}/></div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-tight mb-1.5">Mandi Rate Lock</p>
                    <p className="text-[13px] text-zinc-400 font-medium leading-relaxed opacity-90">Upon submission, your base rate is locked against SMK Mandi fluctuations for 48 hours.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-white/5 rounded-2xl text-emerald-500 border border-white/10 shadow-lg"><MapPin size={20}/></div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-tight mb-1.5">Site-Optimized Logistics</p>
                    <p className="text-[13px] text-zinc-400 font-medium leading-relaxed opacity-90">Hyper-local routing specialized for the Sangli-Miraj-Kupwad industrial corridor.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-200 shadow-[0_48px_128px_-32px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="mb-14">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter font-display mb-3">Site Details</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Provide delivery coordinates & project context</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {!user && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4 text-emerald-700">
                  <Lock size={20} />
                  <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">Login required to satisfying structural audit logs.</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Site POC Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                    placeholder="Project Lead"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Number</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm"
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">SMK Region</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 outline-none font-bold text-sm focus:bg-white focus:border-emerald-500 transition-all appearance-none"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  >
                    {CITIES.map(c => <option key={c.id} value={c.name}>{c.name} District</option>)}
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Type</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 outline-none font-bold text-sm focus:bg-white focus:border-emerald-500 transition-all appearance-none"
                    value={formData.projectType}
                    onChange={e => setFormData({...formData, projectType: e.target.value})}
                  >
                    <option>Residential (Indiv.)</option>
                    <option>Commercial Complex</option>
                    <option>Industrial Site</option>
                    <option>Govt. Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Landmarks</label>
                <textarea 
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500 transition-all font-bold text-sm h-32 resize-none"
                  placeholder="Street No., Plot No., nearest chowk..."
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />} 
                  {user ? 'Lock Procurement Manifest' : 'Sign In to Secure Manifest'}
                </button>
                <p className="text-[10px] text-zinc-400 text-center font-bold uppercase tracking-widest mt-8 leading-relaxed px-6">By submitting, you agree to a logistics audit. Our desk will call for final Mandi rate parity confirmation.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;
