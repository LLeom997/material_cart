import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { OrderStatus, Enquiry } from '../types';
import { 
  LayoutDashboard, 
  Clock, 
  CheckSquare, 
  MoreVertical, 
  Truck, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  X,
  RefreshCcw,
  PackageSearch,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const { isAdmin, enquiries, fetchEnquiries } = useApp();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<OrderStatus>(OrderStatus.PENDING);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchEnquiries();
    }
  }, [isAdmin]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEnquiries();
    setIsRefreshing(false);
  };

  const handleUpdate = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: statusUpdate,
        admin_notes: adminNotes 
      })
      .eq('order_id', selectedEnquiry.id);

    setIsUpdating(false);

    if (error) {
      alert(`Update failed: ${error.message}`);
    } else {
      setSelectedEnquiry(null);
      fetchEnquiries();
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-16 md:py-24 font-sans animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase font-display">Logistics Control</h1>
          <p className="text-slate-500 font-medium text-lg">Manage regional site procurement and status audits.</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={handleRefresh}
             className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 hover:shadow-lg transition-all active:rotate-180 duration-500"
           >
             <RefreshCcw size={20} className={isRefreshing ? 'animate-spin' : ''} />
           </button>
           <div className="bg-white px-8 py-4 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
             <Clock className="text-brand-500" size={20} />
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Requests</span>
               <span className="font-black text-slate-900">{enquiries.filter(e => e.status !== OrderStatus.DELIVERED).length} Pending</span>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Enquiry ID</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Site Contact</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Materials</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Status</th>
                <th className="px-10 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {enquiries.map(enquiry => (
                <tr key={enquiry.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <span className="font-mono text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{enquiry.id}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3 mb-1.5">
                       <UserIcon size={14} className="text-slate-300" />
                       <p className="font-black text-slate-900 uppercase tracking-tight text-sm">{enquiry.customerName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone size={14} className="text-slate-300" />
                       <a href={`tel:${enquiry.phone}`} className="text-xs font-bold text-brand-600 hover:underline">{enquiry.phone}</a>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                       {enquiry.items.slice(0, 3).map((item, i) => (
                         <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                           {item.productName}
                         </span>
                       ))}
                       {enquiry.items.length > 3 && <span className="text-[10px] font-black text-slate-400 ml-1">+{enquiry.items.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      enquiry.status === OrderStatus.PENDING ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      enquiry.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-700 border border-green-100' :
                      'bg-slate-900 text-white'
                    }`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <button 
                      onClick={() => {
                        setSelectedEnquiry(enquiry);
                        setStatusUpdate(enquiry.status);
                        setAdminNotes(enquiry.adminNotes || '');
                      }}
                      className="w-12 h-12 flex items-center justify-center bg-white rounded-xl border border-slate-100 text-slate-300 hover:text-slate-900 hover:shadow-xl transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center">
                       <PackageSearch size={64} className="text-slate-100 mb-6" />
                       <p className="text-slate-300 font-black uppercase text-xs tracking-widest">Zero site requests in log.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Corporate Audit Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-12 animate-fadeIn">
          <div className="bg-white rounded-[3.5rem] w-full max-w-3xl shadow-[0_64px_128px_-32px_rgba(0,0,0,0.4)] overflow-hidden animate-slideInUp">
            <div className="p-12 md:p-16">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="text-[11px] font-black text-brand-500 uppercase tracking-[0.4em] block mb-3">Sourcing Management</span>
                  <h2 className="text-4xl font-black text-slate-900 uppercase font-display tracking-tighter leading-none">Order Audit: {selectedEnquiry.id}</h2>
                </div>
                <button onClick={() => setSelectedEnquiry(null)} className="p-4 bg-slate-50 text-slate-300 hover:text-slate-900 rounded-2xl transition-all"><X size={24}/></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-8">
                   <div className="flex gap-5">
                      <div className="p-3 bg-slate-100 rounded-2xl text-slate-400"><MapPin size={22}/></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Site Location</p>
                        <p className="font-bold text-slate-900 text-sm leading-relaxed">{selectedEnquiry.location}, {selectedEnquiry.city}</p>
                      </div>
                   </div>
                   <div className="flex gap-5">
                      <div className="p-3 bg-slate-100 rounded-2xl text-slate-400"><RefreshCcw size={22}/></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Update Cycle</p>
                        <select 
                          className="bg-transparent font-black text-brand-600 outline-none appearance-none cursor-pointer text-base uppercase tracking-tight"
                          value={statusUpdate}
                          onChange={e => setStatusUpdate(e.target.value as OrderStatus)}
                        >
                          {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Dispatch Notes</h4>
                   <textarea 
                    className="w-full bg-white px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-sm h-32 resize-none"
                    placeholder="Logistics updates (Visible to site manager)..."
                    value={adminNotes}
                    onChange={e => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => setSelectedEnquiry(null)}
                  className="flex-grow py-6 rounded-[1.5rem] font-black text-slate-400 uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  disabled={isUpdating}
                  onClick={handleUpdate}
                  className="flex-grow bg-slate-900 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-brand-500 hover:text-slate-900 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isUpdating ? <RefreshCcw size={18} className="animate-spin" /> : <CheckSquare size={18} />} Commit Status to Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;