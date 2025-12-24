
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
// Fix: Added ArrowLeft to the imported icons
import { Search, Package, CheckCircle2, Phone, AlertCircle, Clock, Truck, ClipboardCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { OrderStatus, Enquiry } from '../types';
import { BUSINESS_PHONE } from '../constants';
import { supabase } from '../lib/supabase';

const TrackOrder: React.FC = () => {
  const { user } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Enquiry | null>(null);
  const [userOrders, setUserOrders] = useState<Enquiry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUserOrders(data.map(formatOrder));
    }
    setIsLoading(false);
  };

  const formatOrder = (o: any): Enquiry => ({
    id: o.order_id,
    customerName: o.customer_name,
    phone: o.phone,
    city: o.city,
    location: o.location,
    projectType: o.project_type,
    items: o.items,
    status: o.status as OrderStatus,
    createdAt: o.created_at,
    adminNotes: o.admin_notes
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`order_id.eq.${query},phone.eq.${query}`)
      .single();

    if (!error && data) {
      setResult(formatOrder(data));
    } else {
      setResult(null);
    }
    setHasSearched(true);
    setIsLoading(false);
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 1;
      case OrderStatus.CALLED: return 2;
      case OrderStatus.CONFIRMED: return 3;
      case OrderStatus.DELIVERED: return 4;
      default: return 1;
    }
  };

  const Step = ({ index, active, label, icon: Icon, isLast }: any) => (
    <div className={`flex flex-col items-center flex-1 relative ${isLast ? '' : 'after:content-[""] after:h-[2px] after:w-full after:bg-slate-100 after:absolute after:top-7 after:left-1/2 after:-z-10'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 z-10 ${active ? 'bg-slate-900 text-brand-500 scale-110 shadow-xl' : 'bg-slate-100 text-slate-300'}`}>
        <Icon size={22} strokeWidth={active ? 3 : 2} />
      </div>
      <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-center ${active ? 'text-slate-900' : 'text-slate-300'}`}>{label}</p>
    </div>
  );

  return (
    <div className="bg-brand-50 min-h-screen animate-fadeIn font-sans">
      <div className="max-w-5xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase font-display">Live Pipeline</h1>
          <p className="text-slate-500 font-medium text-lg">Visibility into your site's material procurement status.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-slate-900/5 border border-slate-100 mb-16 flex flex-col md:flex-row items-stretch gap-4">
          <div className="flex-grow flex items-center px-8 py-5 md:py-0 gap-4 bg-slate-50 rounded-3xl border border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
            <Search className="text-slate-300" size={24} />
            <input 
              type="text" 
              className="bg-transparent w-full focus:outline-none text-slate-900 font-bold placeholder:text-slate-300 text-lg tracking-tight"
              placeholder="Search by ID or Mobile..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] font-black hover:bg-brand-500 hover:text-slate-900 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ClipboardCheck size={20} />} TRACK NOW
          </button>
        </form>

        {user && userOrders.length > 0 && !hasSearched && (
          <div className="mb-20 animate-slideInUp">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">Your Site History <div className="h-px bg-slate-200 flex-grow"></div></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {userOrders.map(order => (
                 <div key={order.id} onClick={() => { setResult(order); setHasSearched(true); }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-brand-500 transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                    <div className="flex justify-between items-start mb-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-brand-500 text-slate-900'}`}>{order.status}</span>
                       <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-slate-900">{order.id}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 font-display">{order.customerName}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{order.items.length} Materials Procured</p>
                    <div className="mt-8 flex justify-end">
                      <ArrowRight className="text-slate-200 group-hover:text-brand-500 transition-transform group-hover:translate-x-1" size={20} />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {hasSearched && result && (
          <div className="animate-slideInUp space-y-12 pb-20">
            <button onClick={() => { setHasSearched(false); setResult(null); }} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2 mb-4">
              <ArrowLeft size={16} /> Back to History
            </button>
            <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-xl flex items-start gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Package size={120} />
              </div>
              <Step index={1} active={getStatusStep(result.status) >= 1} label="Request Logged" icon={Clock} />
              <Step index={2} active={getStatusStep(result.status) >= 2} label="Verification" icon={Phone} />
              <Step index={3} active={getStatusStep(result.status) >= 3} label="Rate Locked" icon={ClipboardCheck} />
              <Step index={4} active={getStatusStep(result.status) >= 4} label="Dispatched" icon={Truck} isLast />
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="bg-slate-900 p-12 md:p-20 text-white flex flex-col md:flex-row justify-between items-center gap-10 relative">
                <div className="text-center md:text-left z-10">
                  <span className="text-[11px] font-black text-brand-500 uppercase tracking-[0.4em] block mb-4">Live Warehouse Status</span>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display leading-none">{result.status}</h2>
                </div>
                <div className="px-10 py-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md z-10 text-center md:text-right">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Tracking ID</span>
                  <span className="text-3xl font-mono font-bold text-brand-500">{result.id}</span>
                </div>
              </div>
              
              <div className="p-12 md:p-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16 pb-16 border-b border-slate-100">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-6">Site Registry</h4>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2 font-display">{result.customerName}</p>
                    <p className="text-slate-500 font-extrabold text-lg mb-8">{result.phone}</p>
                    <div className="flex gap-3">
                      <div className="bg-slate-50 px-6 py-4 rounded-2xl text-[10px] font-black text-slate-600 border border-slate-100 uppercase tracking-widest shadow-sm">
                         {result.projectType} Site
                      </div>
                      <div className="bg-slate-50 px-6 py-4 rounded-2xl text-[10px] font-black text-slate-600 border border-slate-100 uppercase tracking-widest shadow-sm">
                         {result.city} Zone
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-6">Bill of Materials</h4>
                    <div className="space-y-3">
                      {result.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50/50 px-8 py-5 rounded-2xl border border-slate-100 group hover:bg-white transition-colors">
                          <span className="text-slate-900 font-black text-sm uppercase tracking-tight">{item.productName}</span>
                          <span className="text-brand-600 font-black text-xs uppercase tracking-widest">{item.quantity} {item.uom}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {result.adminNotes && (
                  <div className="p-10 bg-slate-900 rounded-[3rem] text-white mb-16 flex gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none"><Truck size={100}/></div>
                    <div className="bg-brand-500 text-slate-900 p-4 h-fit rounded-2xl shadow-xl"><Package size={28}/></div>
                    <div className="flex-grow">
                      <h4 className="text-[11px] font-black text-brand-500 uppercase tracking-widest mb-4">Official Dispatch Desk Update</h4>
                      <p className="text-slate-300 font-medium text-lg leading-relaxed italic opacity-90">"{result.adminNotes}"</p>
                    </div>
                  </div>
                )}

                <a href={`tel:${BUSINESS_PHONE}`} className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-brand-500 hover:text-slate-900 transition-all uppercase tracking-widest text-xs shadow-2xl">
                  <Phone size={20} /> CONTACT LOGISTICS MANAGER
                </a>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !result && !isLoading && (
          <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-200 animate-slideInUp">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-200 border border-slate-100 shadow-inner">
              <AlertCircle size={56} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">Tracking ID Not Found</h3>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest max-w-sm mx-auto leading-relaxed">Ensure you have the correct unique procurement ID from your order receipt.</p>
            <button onClick={() => setHasSearched(false)} className="mt-12 text-[10px] font-black uppercase tracking-widest text-brand-600 border-b-2 border-brand-500 pb-1">Reset Tracker</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
