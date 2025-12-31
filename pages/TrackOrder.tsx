
import React, { useState, useEffect, useMemo } from 'react';
// Fix: Use type assertion for react-router-dom exports to bypass environment-specific type resolution issues
import * as reactRouterDom from 'react-router-dom';
import { useApp } from '../App';
import { 
  Search, Package, Clock, Truck, 
  ClipboardCheck, ArrowLeft, Loader2, 
  RefreshCw, ChevronRight, MapPin, 
  Calendar, Hash, Wallet, BarChart3,
  FileText, ExternalLink, CheckCircle2
} from 'lucide-react';
import { OrderStatus, Enquiry } from '../types';
import { BUSINESS_PHONE } from '../constants';
import { supabase } from '../lib/supabase';

const { Link } = reactRouterDom as any;

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
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setUserOrders(data.map(formatOrder));
    } catch (e) {
      console.error("Failed to load procurement history:", e);
    } finally {
      setIsLoading(false);
    }
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
    adminNotes: o.admin_notes,
    total_amount: o.total_amount
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_id.eq.${query},phone.eq.${query}`)
        .maybeSingle();

      if (error) throw error;
      if (data) setResult(formatOrder(data));
      else setResult(null);
      setHasSearched(true);
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalValue = userOrders.reduce((acc, o) => acc + (o.total_amount || 0), 0);
    const active = userOrders.filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length;
    const completed = userOrders.filter(o => o.status === OrderStatus.DELIVERED).length;
    return { totalValue, active, completed };
  }, [userOrders]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case OrderStatus.SHIPPED: return 'bg-purple-100 text-purple-700 border-purple-200';
      case OrderStatus.DELIVERED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  const reorder = (items: any[]) => {
    items.forEach(item => addToCart(item));
    alert('Manifest items added to your active list.');
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3">
               <span>Logistics Hub</span>
               <ChevronRight size={10} />
               <span className="text-zinc-900">Client Workspace</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter font-display">Procurement Desk</h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">Manage and track site-wise material manifests.</p>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-[400px] flex gap-2 p-1.5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
            <div className="flex-grow flex items-center px-4 gap-3 bg-zinc-50 rounded-xl">
              <Search className="text-zinc-300" size={16} />
              <input 
                type="text" 
                className="bg-transparent w-full py-3 outline-none text-zinc-900 font-bold text-xs"
                placeholder="Tracking ID (e.g. MCART-123456)"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-zinc-900 text-white px-6 rounded-xl font-bold hover:bg-emerald-600 transition-all text-[10px] uppercase tracking-widest active:scale-95 shadow-lg">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Track'}
            </button>
          </form>
        </div>

        {/* User Workspace View */}
        {user ? (
          <div className="animate-fade-in space-y-12">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Procurement Value', val: `₹${stats.totalValue.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Active Manifests', val: stats.active, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Completed Deliveries', val: stats.completed, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all">
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Area */}
            {!hasSearched ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Recent Procurement History</h2>
                  <button onClick={fetchUserOrders} className="text-[10px] font-bold text-emerald-600 flex items-center gap-2 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all">
                    <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Sync
                  </button>
                </div>

                {userOrders.length === 0 && !isLoading ? (
                  <div className="bg-white rounded-[2.5rem] p-20 text-center border border-zinc-100 shadow-sm">
                    <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-300">
                      <BarChart3 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tighter">No History Found</h3>
                    <p className="text-sm text-zinc-400 mb-8 max-w-sm mx-auto">You haven't locked in any manifests yet. Browse the catalog to start sourcing.</p>
                    <Link to="/listing" className="bg-zinc-900 text-white px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">Open Catalog</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {userOrders.map(order => (
                      <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 hover:border-emerald-500/30 transition-all shadow-sm group">
                        <div className="flex justify-between items-start mb-10">
                           <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 bg-zinc-50 px-3 py-1 rounded-lg border border-zinc-100 w-fit">
                               <Hash size={12} /> {order.id}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                               <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                             </div>
                           </div>
                           <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border tracking-widest ${getStatusColor(order.status)}`}>
                             {order.status}
                           </span>
                        </div>
                        
                        <div className="mb-10">
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 group-hover:text-emerald-600 transition-colors leading-none">{order.customerName}</h3>
                          <div className="flex items-start gap-2 text-xs text-zinc-400 font-medium">
                            <MapPin size={14} className="mt-0.5 shrink-0" /> {order.location}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-10 p-5 bg-zinc-50 rounded-3xl border border-zinc-100">
                           <div>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Manifest Value</p>
                              <p className="text-lg font-black text-zinc-900 font-mono tracking-tight">₹{(order.total_amount || 0).toLocaleString()}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Material Units</p>
                              <p className="text-lg font-black text-zinc-900 font-mono tracking-tight">{order.items.length} Sku(s)</p>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                          <button onClick={() => { setResult(order); setHasSearched(true); }} className="text-[10px] font-black text-zinc-900 uppercase bg-zinc-100 px-6 py-3 rounded-xl hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-2 group/btn">
                            Track Pipeline <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                          <button onClick={() => reorder(order.items)} className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Clone Manifest">
                            <RefreshCw size={18}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-slideInUp space-y-12">
                <button onClick={() => { setHasSearched(false); setResult(null); }} className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 uppercase tracking-widest flex items-center gap-2 group transition-all">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Dashboard
                </button>

                {result ? (
                  <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-zinc-200 shadow-2xl shadow-zinc-200/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2.5 h-full bg-emerald-500"></div>
                    
                    <div className="flex flex-col lg:flex-row justify-between gap-20">
                      <div className="flex-1">
                        <div className="mb-16">
                          <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.4em] block mb-4">Tracking Timeline</span>
                          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 uppercase font-display tracking-tighter leading-none">{result.status}</h2>
                          
                          {/* Progress Tracker */}
                          <div className="flex items-center gap-4 mt-12 max-w-2xl">
                             {[OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED].map((st, i) => {
                               const isActive = result.status === st;
                               const isPassed = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.SHIPPED, OrderStatus.DELIVERED].indexOf(result.status) >= i;
                               return (
                                 <React.Fragment key={st}>
                                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${isActive ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-110' : isPassed ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-zinc-50 border-zinc-100 text-zinc-300'}`}>
                                      {st === OrderStatus.PENDING && <Clock size={18} />}
                                      {st === OrderStatus.CONFIRMED && <ClipboardCheck size={18} />}
                                      {st === OrderStatus.SHIPPED && <Truck size={18} />}
                                      {st === OrderStatus.DELIVERED && <CheckCircle2 size={18} />}
                                   </div>
                                   {i < 3 && <div className={`flex-grow h-1.5 rounded-full transition-all ${isPassed ? 'bg-emerald-500' : 'bg-zinc-100'}`}></div>}
                                 </React.Fragment>
                               );
                             })}
                          </div>
                        </div>

                        <div className="space-y-6 mb-16">
                           <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Package size={14}/> Sourced Material Manifest</h4>
                           {result.items.map((item, i) => (
                             <div key={i} className="flex justify-between items-center p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 hover:bg-white hover:border-emerald-200 transition-all group">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"><Package size={20} className="text-zinc-300"/></div>
                                  <div>
                                    <span className="text-sm font-black text-slate-900 uppercase block leading-none mb-1">{item.productName}</span>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Regional SMK Grade</span>
                                  </div>
                                </div>
                                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{item.quantity} {item.uom}</span>
                             </div>
                           ))}
                        </div>

                        <div className="p-8 bg-zinc-50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
                           <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Site Logistics Note</h4>
                           <p className="text-sm text-zinc-600 font-medium italic leading-relaxed">
                             {result.adminNotes || "Our logistics desk has verified stock levels for your site coordinates. A site manager will receive a final confirmation call before the dispatch cycle begins."}
                           </p>
                        </div>
                      </div>

                      <div className="w-full lg:w-[400px] shrink-0">
                        <div className="bg-zinc-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden h-full flex flex-col border border-white/5">
                           <div className="absolute top-12 right-12 opacity-[0.05] pointer-events-none"><Hash size={120} /></div>
                           
                           <div className="mb-12">
                              <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] block mb-12">Manifest Audit Log</span>
                              <div className="space-y-10">
                                <div>
                                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Project Lead (POC)</p>
                                   <p className="text-2xl font-black text-white uppercase tracking-tight">{result.customerName}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-3">Site Coordinates</p>
                                   <div className="flex items-start gap-3">
                                     <MapPin size={18} className="text-emerald-500 mt-1 shrink-0" />
                                     <p className="text-sm text-zinc-300 font-medium leading-relaxed">{result.location}, {result.city}</p>
                                   </div>
                                </div>
                              </div>
                           </div>

                           <div className="mt-auto pt-10 border-t border-white/10">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Total Sourced Value</span>
                                <span className="text-[9px] text-zinc-600 font-bold uppercase">Locked Mandi Rate</span>
                              </div>
                              <p className="text-5xl font-black text-white font-mono tracking-tighter mb-2">₹{(result.total_amount || 0).toLocaleString()}</p>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <FileText size={12} className="text-zinc-600" /> Including 18% Verified GST
                              </p>
                           </div>

                           <button onClick={() => window.print()} className="mt-12 w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-zinc-900 transition-all flex items-center justify-center gap-3">
                              <FileText size={16} /> Print Structural Manifest
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-32 animate-fade-in bg-white border border-zinc-100 rounded-[3rem] shadow-sm">
                     <div className="w-24 h-24 bg-red-50 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-red-100 shadow-sm"><Hash size={48}/></div>
                     <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">Manifest Identifier Missing</h3>
                     <p className="text-zinc-400 font-medium mb-12 max-w-sm mx-auto">The provided ID was not found in our regional SMK registry. Ensure you have entered the ID exactly as seen in your notification.</p>
                     <button onClick={() => setHasSearched(false)} className="bg-zinc-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-zinc-200">Try Different Identifier</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Logged out view */
          <div className="max-w-4xl mx-auto py-32 text-center animate-fade-in">
             <div className="w-24 h-24 bg-zinc-900 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
                <BarChart3 size={48} strokeWidth={2.5} />
             </div>
             <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase font-display mb-6">Client Portal</h2>
             <p className="text-lg text-zinc-500 font-medium mb-12 max-w-xl mx-auto leading-relaxed opacity-80">Authenticate to access your site manifests, tracking logs, and historical procurement data.</p>
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link to="/auth" className="bg-zinc-900 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-all shadow-2xl active:scale-95">Enter Workspace</Link>
               <a href={`tel:${BUSINESS_PHONE}`} className="bg-white border-2 border-zinc-100 text-zinc-400 px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] hover:border-zinc-900 hover:text-zinc-900 transition-all flex items-center justify-center gap-3">Contact Support</a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
