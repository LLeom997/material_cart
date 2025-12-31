
import React from 'react';
import { Search, RefreshCcw } from 'lucide-react';

interface HeaderBarProps {
  active: string;
  refresh: () => void;
  loading: boolean;
  setModal: (m: any) => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ active, refresh, loading, setModal }) => {
  const getTitle = () => {
    switch(active) {
      case 'orders': return 'Order Pipeline';
      case 'clients': return 'Client Hub';
      case 'suppliers': return 'Source Registry';
      case 'stock': return 'Material Stock';
      case 'books': return 'Financial Ledger';
      case 'logs': return 'System Activity';
      default: return 'Dashboard';
    }
  };

  const handleCreate = () => {
    if (active === 'stock') setModal({ type: 'entity', entityType: 'product', table: 'products', data: { specifications: [], gst_percentage: 18 } });
    else if (active === 'suppliers') setModal({ type: 'entity', entityType: 'supplier', table: 'vendors', data: { isActive: true } });
    else if (active === 'clients') setModal({ type: 'entity', entityType: 'client', table: 'profiles', data: { role: 'client' } });
  };

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{getTitle()}</h2>
        <div className="h-6 w-px bg-slate-200"></div>
        <div className="relative w-80 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text" 
            placeholder={`Search ${active}...`} 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
         <button onClick={refresh} className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
           <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
         </button>
         {(active === 'stock' || active === 'suppliers' || active === 'clients') && (
           <button 
              onClick={handleCreate}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-500 hover:text-slate-900 transition-all shadow-lg active:scale-95"
            >
              + New Record
           </button>
         )}
      </div>
    </header>
  );
};

export default HeaderBar;
