
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Search, Package, Clock, Truck, ClipboardCheck, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { OrderStatus, Enquiry } from '../types';
import { BUSINESS_PHONE } from '../constants';
import { supabase } from '../lib/supabase';

const TrackOrder: React.FC = () => {
  const { user, addToCart } = useApp();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Enquiry | null>(null);
  const [userOrders, setUserOrders] = useState<Enquiry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) fetchUserOrders();
  }, [user]);

  const fetchUserOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) setUserOrders(data.map(formatOrder));
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

    if (!error && data) setResult(formatOrder(data));
    else setResult(null);
    setHasSearched(true);
    setIsLoading(false);
  };

  const reorder = (items: any[]) => {
    items.forEach(item => addToCart(item));
    alert('Items added back to procurement list.');
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

  return (
    <div className="bg-brand-50 min-h-screen animate-fadeIn font-sans">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase font-display">Client Workspace</h1>
          <p className="text-slate-500 font-medium">Track site deliveries and project procurement history.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 mb-16 flex flex-col md:flex-row items-stretch gap-3">
          <div className="flex-grow flex items-center px-6 py-4 md:py-0 gap-3 bg-slate-50 rounded-xl border border-slate-100">
            <Search className="text-slate-300" size={20} />
            <input 
              type="text" 
              className="bg-transparent w-full outline-none text-slate-900 font-bold text-sm"
              placeholder="Search Order ID..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-500 hover:text-slate-900 transition-all text-xs uppercase tracking-widest">
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Track Pipeline'}
          </button>
        </form>

        {user && userOrders.length > 0 && !hasSearched && (
          <div className="animate-slideInUp">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Order History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {userOrders.map(order => (
                 <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-brand-500 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <span className="px-3 py-1 bg-slate-900 text-brand-500 rounded-lg text-[10px] font-bold uppercase">{order.status}</span>
                       <span className="text-[10px] font-mono font-bold text-slate-300">{order.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight mb-4">{order.customerName}</h3>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <button onClick={() => reorder(order.items)} className="text-[10px] font-bold text-brand-600 flex items-center gap-1.5 uppercase hover:text-slate-900 transition-colors">
                        <RefreshCw size={12}/> Re-order Batch
                      </button>
                      <button onClick={() => { setResult(order); setHasSearched(true); }} className="text-[10px] font-bold text-slate-400 uppercase">View Timeline</button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {hasSearched && result && (
          <div className="animate-slideInUp space-y-8">
            <button onClick={() => { setHasSearched(false); setResult(null); }} className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-4">
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl">
               <div className="flex flex-col md:flex-row justify-between gap-10">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Live Status</span>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-6 uppercase font-display leading-none">{result.status}</h2>
                    <div className="space-y-4">
                       {result.items.map((item, i) => (
                         <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-900">{item.productName}</span>
                            <span className="text-xs font-bold text-slate-400">{item.quantity} {item.uom}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 bg-slate-900 p-8 rounded-3xl text-white">
                     <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-4">Audit Registry</h4>
                     <p className="text-xl font-bold mb-1">{result.customerName}</p>
                     <p className="text-sm text-slate-400 mb-6">{result.location}</p>
                     <div className="pt-6 border-t border-white/10">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Logistics ID</p>
                        <p className="text-lg font-mono font-bold text-brand-500">{result.id}</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
